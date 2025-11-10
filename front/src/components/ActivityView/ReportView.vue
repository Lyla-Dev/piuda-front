<template>
  <div class="page">
    <h1 class="page-title">해양 쓰레기 신고서</h1>

    <!-- 발견 위치 -->
    <section class="card">
      <h2 class="card-title">발견 위치 *</h2>

      <!-- 네이버 지도 (정사각형 큰 사이즈) -->
      <div class="map">
        <div id="naverMap" class="map-area-large"></div>
      </div>

      <p class="coords">📍 지도를 드래그하여 정확한 위치를 선택하세요</p>
      <p class="coords">좌표: ({{ coords.lng.toFixed(4) }}, {{ coords.lat.toFixed(4) }})</p>
    </section>

    <!-- 사진 첨부 -->
    <section class="card">
      <h2 class="card-title">사진 첨부 (최대 10MB, JPG/PNG)</h2>

      <div class="upload">
        <label class="dropzone" @dragover.prevent @drop.prevent="onDrop">
          <input type="file" accept="image/png, image/jpeg" multiple class="file" @change="onFiles" />
          <div class="drop-content">
            <span class="icon">📷</span>
            <span>클릭하거나 이미지를 끌어다 놓으세요</span>
          </div>
        </label>

        <ul class="thumbs" v-if="previews.length">
          <li v-for="(src, i) in previews" :key="i">
            <img :src="src" alt="" />
          </li>
        </ul>
      </div>
    </section>

    <!-- 상세 추가 설명 -->
    <section class="card">
      <h2 class="card-title">(선택) 추가 설명 (최대 200자)</h2>
      
      <InputField
        v-model="form.description"
        as="textarea"
        placeholder="쓰레기 종류, 수거 시 주의점 등을 자유롭게 작성해주세요"
        :rows="4"
      />
    </section>

    <div class="actions">
      <button class="primary" @click="submit">해양쓰레기 제보하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/common/InputField.vue'
import axios from 'axios'

const router = useRouter()

const form = ref({
  description: ''
})

const coords = ref({ lng: 126.9784, lat: 37.5666 }) // 서울 중심으로 초기값
const map = ref(null)
const marker = ref(null)

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

// 지도 초기화
const initializeMap = () => {
  if (!window.naver || !window.naver.maps) {
    console.error('네이버 지도 API가 로드되지 않았습니다.')
    return
  }

  const mapOptions = {
    center: new window.naver.maps.LatLng(coords.value.lat, coords.value.lng),
    zoom: 15,
    mapTypeControl: false,
    scaleControl: true,
    logoControl: true,
    mapDataControl: true
  }

  map.value = new window.naver.maps.Map('naverMap', mapOptions)
  
  // 지도 중앙에 고정된 마커 생성 (드래그 불가)
  marker.value = new window.naver.maps.Marker({
    position: new window.naver.maps.LatLng(coords.value.lat, coords.value.lng),
    map: map.value,
    draggable: false
  })

  // 지도 드래그 이벤트 리스너 - 지도가 움직일 때마다 중앙 좌표 업데이트
  window.naver.maps.Event.addListener(map.value, 'dragend', function() {
    const center = map.value.getCenter()
    coords.value.lat = center.lat()
    coords.value.lng = center.lng()
    
    // 마커 위치도 지도 중앙으로 업데이트
    marker.value.setPosition(center)
  })

  // 지도 중심이 변경될 때도 좌표 업데이트 (확대/축소 등)
  window.naver.maps.Event.addListener(map.value, 'center_changed', function() {
    const center = map.value.getCenter()
    coords.value.lat = center.lat()
    coords.value.lng = center.lng()
    
    // 마커 위치도 지도 중앙으로 업데이트
    marker.value.setPosition(center)
  })
}

const previews = ref([])

function onFiles(e) {
  loadPreviews([...e.target.files])
}

function onDrop(e) {
  const files = [...e.dataTransfer.files].filter(f => /image\/(png|jpe?g)/.test(f.type))
  loadPreviews(files)
}

function loadPreviews(files) {
  previews.value = []
  files.slice(0, 8).forEach(file => {
    const url = URL.createObjectURL(file)
    previews.value.push(url)
  })
}

function submit() {
  // 사진이 없으면 경고
  if (!previews.value.length) {
    alert('사진을 첨부해주세요.')
    return
  }

  // API 명세에 맞게 payload 구성
  const payload = {
    x: coords.value.lng,
    y: coords.value.lat,
    content: form.value.description || ''
  }

  // FormData로 multipart/form-data 구성
  const formData = new FormData()

  // payload 부분 (application/json)
  formData.append(
    'payload',
    new Blob([JSON.stringify(payload)], { type: 'application/json' })
  )

  // 사진 파일들 추가 (photos 부분)
  const fileInput = document.querySelector('input[type="file"]')
  if (fileInput && fileInput.files) {
    for (let i = 0; i < fileInput.files.length; i++) {
      formData.append('photos', fileInput.files[i])
    }
  }

  // 백엔드로 전송
  submitToBackend(formData)
}

const submitToBackend = async (formData) => {
  try {
    const response = await axios.post('http://localhost:8080/api/notify', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    console.log('쓰레기 신고 성공:', response.data)
    alert('해양 쓰레기 신고가 성공적으로 접수되었습니다!')
    
    // 성공 시 메인페이지로 이동 (히스토리 스택에 쌓이지 않게 replace 사용)
    router.replace({ name: 'Home' })
  } catch (error) {
    console.error('쓰레기 신고 실패:', error)
    alert('신고 접수에 실패했습니다. 다시 시도해주세요.')
  }
}

// 라이프사이클 훅
onMounted(async () => {
  try {
    await loadNaverMapAPI()
    initializeMap()
  } catch (error) {
    console.error('네이버 지도 API 로드 실패:', error)
  }
})

onBeforeUnmount(() => {
  if (map.value) {
    map.value.destroy()
  }
})
</script>

<style scoped>
/* Layout */
.page {
  background: #eef1f7;
  min-height: 100vh;
  padding: 32px 20px 80px;
  max-width: 900px;
  margin: 0 auto;
}
.page-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 20px;
}
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 20px;
  margin-bottom: 18px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}
.card-title {
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 14px;
}

/* Map - Large Square */
.map { margin-top: 10px; }
.map-area-large {
  width: 100%;
  height: 400px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.coords {
  margin: 8px 2px 0;
  font-size: 12px;
  color: #6b7280;
}

/* Upload */
.upload {
  margin-top: 10px;
}
.dropzone {
  border: 1px dashed #c7cdd8;
  border-radius: 9999px;
  padding: 16px;
  background: #f3f6fb;
  cursor: pointer;
  display: block;
}
.dropzone:hover { background: #eaf0fb; }
.file { display: none; }
.drop-content {
  display: flex; align-items: center; gap: 8px; justify-content: center;
  font-size: 14px; color: #6b7280;
}
.icon { font-size: 18px; }

.thumbs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 10px;
  padding: 0;
  list-style: none;
}
.thumbs li { width: 110px; height: 70px; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
.thumbs img { width: 100%; height: 100%; object-fit: cover; }

/* Actions */
.actions { display: flex; justify-content: center; margin-top: 16px; }
.primary {
  padding: 12px 22px;
  border-radius: 12px;
  background: #2f327d;
  color: #fff;
  font-weight: 700;
  border: none;
  cursor: pointer;
}
.primary:hover { filter: brightness(0.95); }
</style>

<style>
html, body {
  background: #eef1f7 !important;
  min-height: 100vh;
}
</style>
