import { ref, reactive, watch } from 'vue'
import { fetchPinsWithFilters } from './MapApi'

// 핀 이미지 import
import redPinImg from '@/assets/redpin.png'
import bluePinImg from '@/assets/bluepin.png'
import whitePinImg from '@/assets/whitepin.png'

export function useMapLogic() {
  const map = ref(null)
  const pins = ref([]) // 핀 데이터 상태
  const markers = ref([]) // 지도 마커 상태
  const selectedPin = ref(null) // 선택된 핀 정보
  const selectedMarker = ref(null) // 선택된 마커 참조
  
  // 필터 상태
  const filters = reactive({
    startDate: '2025-10-09',
    endDate: '2025-10-09',
    orgs: {
      dft: false,
      ocean: false,
      busan: false,
      covo: false,
      ssdamsokcho: false,
      jigu: false,
      sseom: false,
      cleanup: false,
      ecoteam: false,
      ocean_protect: false,
      project: false,
      environment: false,
      plog: false,
      leader: false,
      plogkorea: false,
      bakaji: false,
      team: false,
      jeju: false,
      honey: false,
      sea: false,
      other: false
    },
    regions: {
      west: false,
      east: false,
      south: false,
      jeju: false,
      inland: false
    },
    quantity: {
      low: false,
      mid: false,
      high: false,
      vhigh: false
    }
  })

  // 네이버 지도 API 키
  const clientId = process.env.VUE_APP_NAVER_MAP_CLIENT_ID

  // 네이버 지도 API 로드
  const loadNaverMapAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.naver && window.naver.maps) {
        resolve()
        return
      }

      const script = document.createElement('script')
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`
      
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  // 마커 크기 조정 (선택 시 크게, 해제 시 원래 크기)
  const resizeMarker = (marker, isSelected) => {
    const icon = marker.getIcon()
    if (icon) {
      const size = isSelected ? 48 : 32 // 선택 시 더 크게
      icon.size = new window.naver.maps.Size(size, size)
      icon.scaledSize = new window.naver.maps.Size(size, size)
      icon.anchor = new window.naver.maps.Point(size / 2, size)
      marker.setIcon(icon)
    }
  }

  // 핀 클릭 시 정보 표시
  const onMarkerClick = (pin, marker) => {
    // 이전 선택된 마커 크기 복원
    if (selectedMarker.value) {
      resizeMarker(selectedMarker.value, false)
    }
    
    // 새로 선택된 마커 크기 증가
    resizeMarker(marker, true)
    
    selectedPin.value = pin
    selectedMarker.value = marker
  }

  // 모달 닫기
  const closeModal = () => {
    // 선택된 마커 크기 복원
    if (selectedMarker.value) {
      resizeMarker(selectedMarker.value, false)
    }
    
    selectedPin.value = null
    selectedMarker.value = null
  }

  // 지도 위에 마커 표시 함수
  const renderMarkers = () => {
    // 기존 마커 제거
    markers.value.forEach(marker => marker.setMap(null))
    markers.value = []
    if (!map.value) return
    
    pins.value.forEach(pin => {
      if (pin.pinY && pin.pinX) {
        let icon = null
        if (pin.pinColor) {
          const color = pin.pinColor.toLowerCase()
          if (color === 'red') {
            icon = {
              url: redPinImg,
              size: new window.naver.maps.Size(32, 32),
              scaledSize: new window.naver.maps.Size(32, 32),
              origin: new window.naver.maps.Point(0, 0),
              anchor: new window.naver.maps.Point(16, 32)
            }
          } else if (color === 'blue') {
            icon = {
              url: bluePinImg,
              size: new window.naver.maps.Size(32, 32),
              scaledSize: new window.naver.maps.Size(32, 32),
              origin: new window.naver.maps.Point(0, 0),
              anchor: new window.naver.maps.Point(16, 32)
            }
          } else if (color === 'white') {
            icon = {
              url: whitePinImg,
              size: new window.naver.maps.Size(32, 32),
              scaledSize: new window.naver.maps.Size(32, 32),
              origin: new window.naver.maps.Point(0, 0),
              anchor: new window.naver.maps.Point(16, 32)
            }
          }
        }
        
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(pin.pinY, pin.pinX),
          map: map.value,
          title: pin.title || pin.pinId?.toString() || '',
          ...(icon ? { icon } : {})
        })
        
        // 마커 클릭 이벤트 추가
        window.naver.maps.Event.addListener(marker, 'click', () => {
          onMarkerClick(pin, marker)
        })
        
        markers.value.push(marker)
      }
    })
  }

  // filters 객체를 API 쿼리 파라미터로 변환
  const buildFilterParams = (filters) => {
    const params = {}
    
    // 날짜
    if (filters.startDate) params.startDate = filters.startDate
    if (filters.endDate) params.endDate = filters.endDate
    
    // 단체명 (체크된 항목들을 배열로)
    const selectedOrgs = Object.keys(filters.orgs).filter(key => filters.orgs[key])
    if (selectedOrgs.length > 0) params.organizations = selectedOrgs
    
    // 권역 (체크된 항목들을 배열로) - 백엔드 형식에 맞게 매핑
    const regionMapping = {
      west: 'WEST_SEA',
      east: 'EAST_SEA', 
      south: 'SOUTH_SEA',
      jeju: 'JEJU',
      inland: 'ULLEUNG'
    }
    const selectedRegions = Object.keys(filters.regions)
      .filter(key => filters.regions[key])
      .map(key => regionMapping[key] || key)
    if (selectedRegions.length > 0) params.regions = selectedRegions
    
    // 수거량 (체크된 항목들을 배열로)
    const selectedQuantities = Object.keys(filters.quantity).filter(key => filters.quantity[key])
    if (selectedQuantities.length > 0) params.quantities = selectedQuantities
    
    console.log('Filter params:', params) // 디버깅용 로그
    return params
  }

  // 핀 데이터 불러오기
  const loadPins = async () => {
    try {
      const filterParams = buildFilterParams(filters)
      console.log('Requesting pins with filters:', filterParams) // 디버깅용 로그
      pins.value = await fetchPinsWithFilters(filterParams)
      console.log('Received pins:', pins.value) // 디버깅용 로그
      renderMarkers()
    } catch (e) {
      console.error('핀 데이터 불러오기 실패:', e)
    }
  }

  // 지도 초기화
  const initializeMap = () => {
    if (!window.naver || !window.naver.maps) {
      console.error('네이버 지도 API가 로드되지 않았습니다.')
      return
    }
    const mapOptions = {
      center: new window.naver.maps.LatLng(36.5, 127.5),
      zoom: 7,
      mapTypeControl: false,
      scaleControl: true,
      logoControl: true,
      mapDataControl: true
    }
    map.value = new window.naver.maps.Map('naverMap', mapOptions)
    // 지도 초기화 후 핀 데이터 불러오기
    loadPins()
  }

  // 필터 초기화 함수
  const resetFilters = () => {
    filters.startDate = '2025-10-09'
    filters.endDate = '2025-10-09'
    
    // 모든 단체 체크 해제
    Object.keys(filters.orgs).forEach(key => {
      filters.orgs[key] = false
    })
    
    // 모든 권역 체크 해제
    Object.keys(filters.regions).forEach(key => {
      filters.regions[key] = false
    })
    
    // 모든 수거량 체크 해제
    Object.keys(filters.quantity).forEach(key => {
      filters.quantity[key] = false
    })
    
    // 필터 초기화 후 핀 새로고침
    loadPins()
  }

  // filters가 변경될 때마다 핀 새로 불러오기
  watch(filters, loadPins, { deep: true })

  return {
    map,
    pins,
    markers,
    filters,
    selectedPin,
    selectedMarker,
    loadNaverMapAPI,
    initializeMap,
    resetFilters,
    renderMarkers,
    loadPins,
    closeModal
  }
}