<template>
  <div class="page">
    <h1 class="page-title">해양 쓰레기 수거 활동 후기</h1>

    <!-- 인원 정보 -->
    <section class="card">
      <h2 class="card-title">인원 정보</h2>
      <div class="grid grid-3">
        <InputField v-model="form.writer" label="작성자" required placeholder="김OO" />
        <InputField v-model="form.memberCount" label="활동인원 수" type="number" unit="명" required />
      </div>
      <InputField v-model="form.title" label="활동 제목" required placeholder="예: 고성 공경리 해변 정화" />
    </section>

    <!-- 활동 위치 및 시간 -->
    <section class="card">
      <h2 class="card-title">활동 위치 및 시간</h2>

      <div class="grid grid-2">
        <div>
          <label class="label">활동 날짜</label>
          <select v-model="form.date" class="select">
            <option disabled value="">연도-월-일</option>
            <option v-for="d in dateOptions" :key="d" :value="d">{{ d }}</option>
          </select>
        </div>

        <InputField v-model="form.placeName" label="활동 위치*" placeholder="예: 공경리 해변" required />
      </div>

      <!-- 네이버 지도 -->
      <div class="map">
        <div id="naverMap" class="map-area"></div>
      </div>

      <p class="coords" v-if="isLocationLoading">📍 현재 위치를 가져오고 있습니다...</p>
      <p class="coords" v-else>📍 지도를 드래그하여 정확한 위치를 선택하세요</p>
      <p class="coords">좌표: ({{ coords.lng.toFixed(4) }}, {{ coords.lat.toFixed(4) }})</p>

      <InputField
        v-model="form.detailAddress"
        as="textarea"
        label="상세 위치"
        placeholder="예: 고성 공경리 해변 입구"
        rows="2"
      />
    </section>

    <!-- 쓰레기 정보 -->
    <section class="card">
      <h2 class="card-title">쓰레기 정보</h2>

      <div class="grid grid-3">
        <InputField v-model="form.totalWeight" label="총 쓰레기 양" type="number" unit="kg" placeholder="무게" />
        <InputField v-model="form.totalVolume" label="부피" type="number" unit="L" placeholder="부피" />
        <div />
      </div>

      <div class="subsection">
        <div class="subsection-head">
          <span class="label">수거한 쓰레기 종류* <small>(해당되는 모든 항목 선택, 개수 입력)</small></span>
        </div>

        <!-- 카테고리 칩 -->
        <div class="chips">
          <button
            v-for="cat in categories"
            :key="cat.key"
            type="button"
            class="chip"
            :class="{ active: !!form.categoryCounts[cat.key] || selectedCats.includes(cat.key) }"
            @click="toggleCat(cat.key)"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- 선택된 카테고리 개수 입력 -->
        <div class="cat-grid" v-if="selectedCats.length">
          <div v-for="key in selectedCats" :key="key" class="cat-row">
            <InputField
              v-model="form.categoryCounts[key]"
              :label="catLabel(key)"
              type="number"
              unit="개"
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 현장사진 및 기록 -->
    <section class="card">
      <h2 class="card-title">현장사진 및 기록</h2>

      <div class="upload">
        <div class="upload-head">
          <span class="badge">필수(최소1)</span>
          <span class="hint">최대 10MB, JPG/PNG</span>
        </div>

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

      <InputField
        v-model="form.note"
        as="textarea"
        label="기록 (최대 2000자)"
        placeholder="활동 동기, 느낀 점 등을 자유롭게 작성해주세요"
        :rows="5"
      />
    </section>

    <!-- 보안 인증 섹션 -->
    <section class="card" v-if="showTurnstile">
      <h2 class="card-title">🛡️ 보안 인증</h2>
      <p class="security-notice">
        봇 공격 방지를 위한 보안 인증입니다. 아래 체크박스를 클릭해주세요.
      </p>
      
      <TurnstileWidget
        ref="turnstileWidget"
        :site-key="process.env.VUE_APP_TURNSTILE_SITE_KEY"
        theme="light"
        size="normal"
        @token="onTurnstileToken"
        @error="onTurnstileError"
      />
      
      <div v-if="turnstileError" class="turnstile-error">
        {{ turnstileError }}
      </div>
    </section>

    <div class="actions">
      <button 
        class="primary" 
        @click="submit" 
        :disabled="isSubmitting"
        :class="{ 'loading': isSubmitting }"
      >
        <span v-if="isSubmitting">등록 중...</span>
        <span v-else>후기 등록하기</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import InputField from '@/components/common/InputField.vue'
import TurnstileWidget from '@/components/common/TurnstileWidget.vue'
import http from '@/api/http'

const router = useRouter()

const form = ref({
  writer: '',
  memberCount: '',
  title: '',
  date: '',
  placeName: '',
  detailAddress: '',
  totalWeight: '',
  totalVolume: '',
  note: '',
  categoryCounts: {}, // { key: number }
})

const coords = ref({ lng: 126.9784, lat: 37.5666 }) // 서울 중심으로 초기값
const map = ref(null)
const marker = ref(null)
const isLocationLoading = ref(false)

// Turnstile 관련
const turnstileWidget = ref(null)
const turnstileToken = ref('')
const turnstileError = ref('')
const isSubmitting = ref(false)
const showTurnstile = ref(false)

// 네이버 지도 API 키
const clientId = process.env.VUE_APP_NAVER_MAP_CLIENT_ID

// 현재 위치 가져오기
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation이 지원되지 않는 브라우저입니다.'))
      return
    }

    isLocationLoading.value = true
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        isLocationLoading.value = false
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        isLocationLoading.value = false
        console.warn('위치 정보를 가져올 수 없습니다:', error.message)
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5분간 캐시된 위치 정보 사용
      }
    )
  })
}

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

const dateOptions = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - i)
  return d.toISOString().slice(0, 10)
})

const categories = [
  { key: 'trashPet', label: '페트병' },
  { key: 'trashBag', label: '비닐봉지' },
  { key: 'trashCan', label: '캔류' },
  { key: 'trashNet', label: '어망/어구류' },
  { key: 'trashGlass', label: '유리병' },
  { key: 'trashRope', label: '로프끈' },
  { key: 'trashCloth', label: '의류' },
  { key: 'trashElec', label: '전자제품' },
  { key: 'trashEtc', label: '기타 폐기물' },
]

const selectedCats = ref([])

function toggleCat(key) {
  const i = selectedCats.value.indexOf(key)
  if (i === -1) selectedCats.value.push(key)
  else {
    selectedCats.value.splice(i, 1)
    delete form.value.categoryCounts[key]
  }
}

function catLabel(key) {
  const item = categories.find(c => c.key === key)
  return item ? item.label : key
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

// Turnstile 이벤트 핸들러
const onTurnstileToken = (token) => {
  turnstileToken.value = token
  turnstileError.value = ''
}

const onTurnstileError = (error) => {
  turnstileError.value = error
  turnstileToken.value = ''
}

function submit() {
  if (isSubmitting.value) return

  // 간단 검증 (필수값)
  const required = [
    ['writer', '작성자'],
    ['memberCount', '활동인원 수'],
    ['title', '활동 제목'],
    ['date', '활동 날짜'],
    ['placeName', '활동 위치'],
  ]
  for (const [k, label] of required) {
    if (!form.value[k]) {
      alert(`${label}을(를) 입력해주세요.`)
      return
    }
  }
  if (!previews.value.length) {
    alert('현장 사진을 1장 이상 업로드해주세요.')
    return
  }

  // Turnstile 검증 표시
  if (!showTurnstile.value) {
    showTurnstile.value = true
    alert('봇 방지를 위한 보안 인증을 완료해주세요.')
    return
  }

  // Turnstile 토큰 확인
  if (!turnstileToken.value) {
    alert('보안 인증을 완료해주세요.')
    return
  }

  if (turnstileError.value) {
    alert('보안 인증 중 오류가 발생했습니다. 다시 시도해주세요.')
    if (turnstileWidget.value) {
      turnstileWidget.value.reset()
    }
    return
  }

  isSubmitting.value = true

  // API 명세에 맞게 payload 구성
  const reportData = {
    reportName: form.value.writer,
    reportPeople: parseInt(form.value.memberCount),
    reportTitle: form.value.title,
    reportDate: form.value.date,
    reportDetailLocation: form.value.detailAddress,
    reportContent: form.value.note,
    pinX: coords.value.lng,
    pinY: coords.value.lat,
    trashKg: parseFloat(form.value.totalWeight) || 0,
    trashL: parseFloat(form.value.totalVolume) || 0,
    trashPet: parseInt(form.value.categoryCounts.trashPet) || 0,
    trashBag: parseInt(form.value.categoryCounts.trashBag) || 0,
    trashNet: parseInt(form.value.categoryCounts.trashNet) || 0,
    trashGlass: parseInt(form.value.categoryCounts.trashGlass) || 0,
    trashCan: parseInt(form.value.categoryCounts.trashCan) || 0,
    trashRope: parseInt(form.value.categoryCounts.trashRope) || 0,
    trashCloth: parseInt(form.value.categoryCounts.trashClothes) || 0,
    trashElec: parseInt(form.value.categoryCounts.trashElec) || 0,
    trashEtc: parseInt(form.value.categoryCounts.trashEtc) || 0
  }

  // FormData로 multipart/form-data 구성
  const formData = new FormData()

  // Turnstile 토큰 추가
  const reportWithToken = {
    ...reportData,
    turnstileToken: turnstileToken.value
  }

  formData.append(
    'report',
    new Blob([JSON.stringify(reportWithToken)], { type: 'application/json' })
  )
  // 사진 파일들 추가
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
    const response = await http.post('/report', formData, {
      /*headers: {
        'Content-Type': 'multipart/form-data'
      }*/
    })
    console.log('후기 등록 성공:', response.data)
    alert('후기가 성공적으로 등록되었습니다!')
    
    // 성공 시 메인페이지로 이동 (히스토리 스택에 쌓이지 않게 replace 사용)
    router.replace({ name: 'Home' })
  } catch (error) {
    console.error('후기 등록 실패:', error)
    
    // 봇 검증 실패인 경우
    if (error.response && error.response.status === 400 && 
        error.response.data && error.response.data.error === 'Bot verification failed') {
      alert('보안 인증에 실패했습니다. 다시 시도해주세요.')
      if (turnstileWidget.value) {
        turnstileWidget.value.reset()
      }
      showTurnstile.value = true
    } else {
      alert('후기 등록에 실패했습니다. 다시 시도해주세요.')
    }
  } finally {
    isSubmitting.value = false
  }
}

// 라이프사이클 훅
onMounted(async () => {
  try {
    // 먼저 현재 위치를 가져오려고 시도
    try {
      const currentLocation = await getCurrentLocation()
      coords.value = currentLocation
      console.log('현재 위치로 설정:', currentLocation)
    } catch (locationError) {
      console.warn('현재 위치를 가져올 수 없어 기본 위치(서울)를 사용합니다:', locationError.message)
      // 기본값 유지
    }
    
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

/* Grid helpers */
.grid {
  display: grid;
  gap: 14px;
  margin-bottom: 10px;
}
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }
@media (max-width: 960px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 720px) {
  .grid-3, .grid-2, .grid-4 { grid-template-columns: 1fr; }
}

/* Reuse from InputField look-alikes */
.label {
  display: inline-block;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 6px;
}
.select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #8C8C8C;
  border-radius: 9999px;
  background: #fff;
  font-size: 14px;
  outline: none;
}
.select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37,99,235,.2);
}

/* Map */
.map { margin-top: 10px; }
.map-area {
  width: 100%;
  height: 300px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}
.coords {
  margin: 8px 2px 0;
  font-size: 12px;
  color: #6b7280;
}

/* Chips */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0 6px;
}
.chip {
  border-radius: 9999px;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
}
.chip.active {
  background: #eef2ff;
  border-color: #6366f1;
}

/* Upload */
.upload-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.badge {
  display: inline-block;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 9999px;
  background: #e8efff;
  color: #1d4ed8;
  font-weight: 700;
}
.hint { font-size: 12px; color: #6b7280; }

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

/* Section subtleties */
.subsection { margin-top: 8px; }
.subsection-head .label { margin-bottom: 0; }

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
  transition: all 0.2s ease;
}
.primary:hover:not(:disabled) { filter: brightness(0.95); }
.primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.primary.loading {
  background: #6b7280;
}

/* Security Section */
.security-notice {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.turnstile-error {
  color: #dc2626;
  font-size: 14px;
  text-align: center;
  margin-top: 8px;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}
</style>

<style>
html, body {
  background: #eef1f7 !important;
  min-height: 100vh;
}
</style>