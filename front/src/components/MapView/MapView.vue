<template>
  <div class="map-container">
    <div id="naverMap" class="map"></div>
    
    <!-- 핀 정보 모달 -->
    <div v-if="selectedPin" class="pin-info-modal" @click="closeModal">
      <div class="pin-info-content" @click.stop>
        <button class="close-btn" @click="closeModal">×</button>
        <h3 class="pin-title">
          <span v-if="selectedPin.pinColor?.toLowerCase() === 'red'">정화필요지역</span>
          <span v-else-if="selectedPin.pinColor?.toLowerCase() === 'blue'">활동완료지역</span>
          <span v-else-if="selectedPin.pinColor?.toLowerCase() === 'white'">신규지역</span>
          <span v-else>핀 정보</span>
        </h3>
        <div class="pin-details">
          <div class="coords">
            <strong>위치 정보:</strong><br>
            위도: {{ selectedPin.pinY?.toFixed(4) }}<br>
            경도: {{ selectedPin.pinX?.toFixed(4) }}
          </div>
          <div v-if="selectedPin.notifyContent" class="notify-content">
            <strong>내용:</strong><br>
            {{ selectedPin.notifyContent }}
          </div>
          <div v-if="selectedPinImageUrl" class="notify-photo">
            <strong>사진:</strong><br>
            <img :src="selectedPinImageUrl" alt="핀 사진" />
          </div>
        </div>
      </div>
    </div>
    
    <!-- 필터 버튼 및 패널 -->
    <div class="filter-container">
      <div class="filter-panel" :class="{ open: isFilterOpen }">
        <div class="filter-content">
          <!-- 날짜 범위 -->
          <div class="filter-section">
            <h4>날짜 범위</h4>
            <div class="date-range-inline">
              <div class="date-input-group">
                <label>시작일</label>
                <input type="date" v-model="filters.startDate" value="2025-10-09">
              </div>
              <span class="date-separator">~</span>
              <div class="date-input-group">
                <label>종료일</label>
                <input type="date" v-model="filters.endDate" value="2025-10-09">
              </div>
            </div>
          </div>
          
          <!-- 단체명 -->
          <div class="filter-section">
            <h4>단체명</h4>
            <div class="organization-grid">
              <label><input type="checkbox" v-model="filters.orgs.dft"> 디프트제주</label>
              <label><input type="checkbox" v-model="filters.orgs.ocean"> 오션케어</label>
              <label><input type="checkbox" v-model="filters.orgs.busan"> 봉크젠</label>
              <label><input type="checkbox" v-model="filters.orgs.covo"> 유명해양청소봉사단 COVO</label>
              <label><input type="checkbox" v-model="filters.orgs.ssdamsokcho"> 쓰담속초</label>
              <label><input type="checkbox" v-model="filters.orgs.jigu"> 지구별악수터</label>
              <label><input type="checkbox" v-model="filters.orgs.sseom"> 쓰좀인</label>
              <label><input type="checkbox" v-model="filters.orgs.cleanup"> 클린넘시캠페인운동본부</label>
              <label><input type="checkbox" v-model="filters.orgs.ecoteam"> 에코팀</label>
              <label><input type="checkbox" v-model="filters.orgs.ocean_protect"> 해양환경보단 레디</label>
              <label><input type="checkbox" v-model="filters.orgs.project"> 프로젝트레츠컨</label>
              <label><input type="checkbox" v-model="filters.orgs.environment"> 한경운동연합</label>
              <label><input type="checkbox" v-model="filters.orgs.plog"> 플로깅물몰</label>
              <label><input type="checkbox" v-model="filters.orgs.leader"> 휴먼리더브</label>
              <label><input type="checkbox" v-model="filters.orgs.plogkorea"> 플로빙코리아</label>
              <label><input type="checkbox" v-model="filters.orgs.bakaji"> 바다키퍼</label>
              <label><input type="checkbox" v-model="filters.orgs.team"> 팀부수터</label>
              <label><input type="checkbox" v-model="filters.orgs.jeju"> 제주바당</label>
              <label><input type="checkbox" v-model="filters.orgs.honey"> 훈디</label>
              <label><input type="checkbox" v-model="filters.orgs.sea"> 다시해봄</label>
              <label><input type="checkbox" v-model="filters.orgs.other"> 개인</label>
            </div>
          </div>
          
          <!-- 권역 -->
          <div class="filter-section">
            <h4>권역</h4>
            <div class="region-options">
              <label><input type="checkbox" v-model="filters.regions.west"> 서해</label>
              <label><input type="checkbox" v-model="filters.regions.east"> 동해</label>
              <label><input type="checkbox" v-model="filters.regions.south"> 남해</label>
              <label><input type="checkbox" v-model="filters.regions.jeju"> 제주</label>
              <label><input type="checkbox" v-model="filters.regions.inland"> 울릉</label>
            </div>
          </div>
          
          <!-- 수거량 -->
          <div class="filter-section">
            <h4>수거량</h4>
            <div class="quantity-options">
              <label><input type="checkbox" v-model="filters.quantity.low"> 0 ~10</label>
              <label><input type="checkbox" v-model="filters.quantity.mid"> 10 ~ 50</label>
              <label><input type="checkbox" v-model="filters.quantity.high"> 50 ~ 100</label>
              <label><input type="checkbox" v-model="filters.quantity.vhigh"> 100 이상</label>
            </div>
          </div>
          
          <!-- 초기화 버튼 -->
          <div class="filter-footer">
            <button class="reset-btn" @click="resetFilters">필터 초기화</button>
          </div>
        </div>
      </div>
      
      <button class="filter-toggle-btn" @click="toggleFilter">
        <span class="filter-text">필터 설정</span>
        <span class="toggle-arrow" :class="{ rotated: isFilterOpen }">▲</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useMapLogic } from './MapLogic'

// MapLogic에서 지도 관련 로직 가져오기
const {
  map,
  filters,
  loadNaverMapAPI,
  initializeMap,
  resetFilters,
  selectedPin,
  selectedPinImageUrl,
  closeModal
} = useMapLogic()

const isFilterOpen = ref(false)

// 필터 토글 함수
const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value
}

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
.map-container {
  width: 100%;
  height: calc(100vh - 80px);
  position: relative;
}

.map {
  width: 100%;
  height: 100%;
}

/* 핀 정보 모달 */
.pin-info-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.pin-info-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  background: #f0f0f0;
}

.pin-title {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 700;
  color: #2f327d;
}

.pin-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coords {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
}

.notify-content {
  font-size: 14px;
  line-height: 1.6;
}

.notify-photo {
  text-align: center;
}

.notify-photo img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 필터 컨테이너 */
.filter-container {
  position: absolute;
  bottom: 60px;
  left: 80px;
  z-index: 1000;
  width: 320px;
}

/* 필터 토글 버튼 */
.filter-toggle-btn {
  background: white;
  border: 1px solid #ddd;
  border-radius: 22px;
  padding: 12px 20px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
  white-space: nowrap;
}

.filter-toggle-btn:hover {
  background: #f8f9fa;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.filter-text {
  flex: 1;
  text-align: center;
}

.toggle-arrow {
  font-size: 12px;
  color: #666;
  transition: transform 0.3s ease;
}

.toggle-arrow.rotated {
  transform: rotate(180deg);
}

/* 필터 패널 */
.filter-panel {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  width: 320px;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.filter-panel.open {
  max-height: calc(100vh - 250px);
  opacity: 1;
  transform: translateY(0);
  overflow-y: auto;
}

.filter-content {
  padding: 16px;
}

/* 필터 푸터 */
.filter-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.reset-btn {
  background: #007bff;
  border: 1px solid #007bff;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.reset-btn:hover {
  background: #0056b3;
  border-color: #0056b3;
}

/* 필터 섹션 */
.filter-section {
  margin-bottom: 14px;
}

.filter-section h4 {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
}

/* 날짜 범위 - 한 줄 */
.date-range-inline {
  display: flex;
  align-items: end;
  gap: 8px;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.date-input-group label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.date-input-group input[type="date"] {
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
  background: #f9f9f9;
}

.date-separator {
  font-size: 14px;
  color: #666;
  margin: 0 4px;
  padding-bottom: 4px;
}

/* 단체명 그리드 */
.organization-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5px 10px;
}

.organization-grid label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  padding: 1px 0;
}

.organization-grid input[type="checkbox"] {
  margin: 0;
  width: 14px;
  height: 14px;
}

/* 권역 옵션 */
.region-options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
}

.region-options label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
}

.region-options input[type="checkbox"] {
  margin: 0;
  width: 15px;
  height: 15px;
}

/* 수거량 옵션 */
.quantity-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 14px;
}

.quantity-options label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
}

.quantity-options input[type="checkbox"] {
  margin: 0;
  width: 15px;
  height: 15px;
}
</style>