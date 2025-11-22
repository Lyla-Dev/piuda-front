<template>
  <div class="filter-container">
    <!-- 펼쳐지는 패널 -->
    <div class="filter-panel" :class="{ open: isFilterOpen }">
      <div class="filter-content">
        <!-- 날짜 범위 -->
        <div class="filter-section">
          <h4>날짜 범위</h4>
          <div class="date-range-inline">
            <div class="date-input-group">
              <label>시작일</label>
              <input type="date" v-model="localFilters.startDate" />
            </div>
            <span class="date-separator">~</span>
            <div class="date-input-group">
              <label>종료일</label>
              <input type="date" v-model="localFilters.endDate" />
            </div>
          </div>
        </div>

        <!-- 단체명 -->
        <div class="filter-section">
          <h4>단체명</h4>
          <div class="organization-grid">
            <label><input type="checkbox" v-model="localFilters.orgs.dft" /> 디프다제주</label>
            <label><input type="checkbox" v-model="localFilters.orgs.ocean" /> 오션케어</label>
            <label><input type="checkbox" v-model="localFilters.orgs.busan" /> 봉그젠</label>
            <label><input type="checkbox" v-model="localFilters.orgs.covo" /> 유명해양청소봉사단 COVO</label>
            <label><input type="checkbox" v-model="localFilters.orgs.ssdamsokcho" /> 쓰담속초</label>
            <label><input type="checkbox" v-model="localFilters.orgs.jigu" /> 지구별약수터</label>
            <label><input type="checkbox" v-model="localFilters.orgs.sseom" /> 쓰줍인</label>
            <label><input type="checkbox" v-model="localFilters.orgs.cleanup" /> 클린낚시캠페인운동본부</label>
            <label><input type="checkbox" v-model="localFilters.orgs.ecoteam" /> 에코팀</label>
            <label><input type="checkbox" v-model="localFilters.orgs.ocean_protect" /> 해양환경보호단 레디</label>
            <label><input type="checkbox" v-model="localFilters.orgs.project" /> 프로젝트퀘스천</label>
            <label><input type="checkbox" v-model="localFilters.orgs.environment" /> 환경운동연합</label>
            <label><input type="checkbox" v-model="localFilters.orgs.plog" /> 플로깅울릉</label>
            <label><input type="checkbox" v-model="localFilters.orgs.leader" /> 휴먼인러브</label>
            <label><input type="checkbox" v-model="localFilters.orgs.plogkorea" /> 플로빙코리아</label>
            <label><input type="checkbox" v-model="localFilters.orgs.bakaji" /> 바다키퍼</label>
            <label><input type="checkbox" v-model="localFilters.orgs.team" /> 팀부스터</label>
            <label><input type="checkbox" v-model="localFilters.orgs.jeju" /> 제주바당</label>
            <label><input type="checkbox" v-model="localFilters.orgs.honey" /> 혼디</label>
            <label><input type="checkbox" v-model="localFilters.orgs.sea" /> 다시해봄</label>
            <label><input type="checkbox" v-model="localFilters.orgs.other" /> 개인</label>
          </div>
        </div>

        <!-- 권역 -->
        <div class="filter-section">
          <h4>권역</h4>
          <div class="region-options">
            <label><input type="checkbox" v-model="localFilters.regions.west" /> 서해</label>
            <label><input type="checkbox" v-model="localFilters.regions.east" /> 동해</label>
            <label><input type="checkbox" v-model="localFilters.regions.south" /> 남해</label>
            <label><input type="checkbox" v-model="localFilters.regions.jeju" /> 제주</label>
            <label><input type="checkbox" v-model="localFilters.regions.inland" /> 울릉</label>
          </div>
        </div>

        <!-- 수거량 -->
        <div class="filter-section">
          <h4>수거량</h4>
          <div class="quantity-options">
            <label><input type="checkbox" v-model="localFilters.quantity.low" /> 0 ~10</label>
            <label><input type="checkbox" v-model="localFilters.quantity.mid" /> 10 ~ 50</label>
            <label><input type="checkbox" v-model="localFilters.quantity.high" /> 50 ~ 100</label>
            <label><input type="checkbox" v-model="localFilters.quantity.vhigh" /> 100 이상</label>
          </div>
        </div>

        <!-- 초기화 버튼 -->
        <div class="filter-footer">
          <button class="reset-btn" @click="handleReset">필터 초기화</button>
        </div>
      </div>
    </div>

    <!-- 접기/펼치기 버튼 -->
    <button class="filter-toggle-btn" @click="toggleFilter">
      <span class="filter-text">{{ isFilterOpen ? '필터 접기' : '필터 펼치기' }}</span>
      <span class="toggle-arrow" :class="{ rotated: isFilterOpen }">▲</span>
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  onReset: {
    type: Function,
    required: true
  }
})

const emit = defineEmits(['update:filters'])

const isFilterOpen = ref(false)

const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value
}

// 깊은 복사 함수
const cloneFilters = (f) => JSON.parse(JSON.stringify(f || {}))

// 로컬 상태: 여기만 v-model로 수정
const localFilters = ref(cloneFilters(props.filters))

// 부모 filters 변경 → 로컬 반영
watch(
  () => props.filters,
  (newVal) => {
    localFilters.value = cloneFilters(newVal)
  },
  { deep: true, immediate: true }
)

// 로컬 변경 → 부모에 emit (v-model:filters)
watch(
  localFilters,
  (newVal) => {
    emit('update:filters', newVal)
  },
  { deep: true }
)

// 초기화 버튼
const handleReset = () => {
  // 부모 필터 리셋
  props.onReset()
  // 부모에서 리셋된 값 기준으로 로컬도 다시 세팅
  localFilters.value = cloneFilters(props.filters)
}
</script>

<style scoped>
.filter-container {
  position: absolute;
  bottom: 60px;
  left: 80px;
  z-index: 1000;
  width: 320px;
}

/* 패널: 처음엔 접혀있다가 .open 되면 펼쳐짐 */
.filter-panel {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
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

/* 나머지 스타일은 그대로 */
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
  font-weight: 400;
}

.date-input-group input[type="date"] {
  padding: 4px 10px;
  border: 1px solid #fff2f2;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  background: #fff2f2;
}

.date-separator {
  font-size: 14px;
  color: #666;
  margin: 0 4px;
  padding-bottom: 4px;
}

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

.filter-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.reset-btn {
  background: white;
  border: 1px solid white;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 14px;
  color: #7886C7;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.reset-btn:hover {
  background: white;
  font-weight: 700;
  text-decoration: underline;
}
</style>
