<template>
  <div class="map-filter-panel">
    <section class="filter-section date-range">
      <h3 class="section-title">날짜 범위</h3>
      <div class="date-input-group">
        <div class="date-item">
          <label for="start-date" class="date-label">시작일</label>
          <input type="date" id="start-date" v-model="filters.startDate" class="date-input">
        </div>
        <div class="date-item">
          <label for="end-date" class="date-label">종료일</label>
          <input type="date" id="end-date" v-model="filters.endDate" class="date-input">
        </div>
      </div>
    </section>

    <hr class="section-divider" />

    <section class="filter-section organizations">
      <h3 class="section-title">단체명</h3>
      <div class="checkbox-grid">
        <label v-for="org in organizationList" :key="org" class="checkbox-item">
          <input type="checkbox" :value="org" v-model="filters.organizations" class="checkbox-input">
          <span class="label-text">{{ org }}</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" value="유명해양정봉사단 COVO" v-model="filters.organizations" class="checkbox-input">
          <span class="label-text">유명해양정봉사단 <span class="logo-text">COVO</span></span>
        </label>
      </div>
    </section>

    <hr class="section-divider" />

    <section class="filter-section regions">
      <h3 class="section-title">권역</h3>
      <div class="checkbox-row">
        <label v-for="region in regionList" :key="region" class="checkbox-item">
          <input type="checkbox" :value="region" v-model="filters.regions" class="checkbox-input">
          <span class="label-text">{{ region }}</span>
        </label>
      </div>
    </section>

    <hr class="section-divider" />

    <section class="filter-section collection-amount">
      <h3 class="section-title">수거량</h3>
      <div class="checkbox-row">
        <label v-for="amount in collectionAmountList" :key="amount.value" class="checkbox-item">
          <input type="checkbox" :value="amount.value" v-model="filters.collectionAmount" class="checkbox-input">
          <span class="label-text">{{ amount.label }}</span>
        </label>
      </div>
    </section>

    <hr class="section-divider" />

    <div class="reset-button-container">
      <button @click="resetFilters" class="reset-button">필터 초기화</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

// 1. 필터 데이터 정의
const filters = ref({
  startDate: '2025-10-09', // 이미지 기반 초기값 설정
  endDate: '2025-10-09',   // 이미지 기반 초기값 설정
  organizations: [],
  regions: [],
  collectionAmount: [],
});

// 2. 항목 리스트 정의 (데이터는 이미지 기반으로 임의 설정)
const organizationList = [
  '디프다제주', '오션케어',
  '봉그젠',
  '쓰담속초', '지구별약수터',
  '쓰줍인', '클린놰시캠페인운동본부',
  '예코팀', '해양환경보호단 레디',
  '프로젝트청춘', '환경운동연합',
  '플로깅올롱', '휴먼인러브',
  '플로빙코리아', '바다지켜',
  '팀부스터', '제주바당',
  '혼디', '다시해봄',
  '개인'
];

const regionList = [
  '서해', '동해', '남해', '제주', '울릉'
];

const collectionAmountList = [
  { label: '0 ~ 10', value: '0-10' },
  { label: '10 ~ 50', value: '10-50' },
  { label: '50 ~ 100', value: '50-100' },
  { label: '100 이상', value: '100+' }
];

// 3. 필터 초기화 함수
const resetFilters = () => {
  filters.value = {
    startDate: '', // 초기화 시 빈 값으로 설정
    endDate: '',
    organizations: [],
    regions: [],
    collectionAmount: [],
  };
};

// 4. 필터 변경 감지 및 부모 컴포넌트로 이벤트 전달 (옵션)
// 필터 변경 시 상위 컴포넌트에 알리려면 아래 코드를 사용
// const emit = defineEmits(['update:filters']);
// watch(filters, (newFilters) => {
//   emit('update:filters', newFilters);
// }, { deep: true });

</script>

<style scoped>
/* 전체 패널 스타일 */
.map-filter-panel {
  width: 300px; /* 적절한 너비 설정 */
  background-color: #f8f8f8;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
  color: #333;
}

/* 섹션 스타일 */
.filter-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.1em;
  font-weight: bold;
  margin-bottom: 15px;
  color: #333;
}

/* 구분선 */
.section-divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 15px 0;
}

/* 날짜 범위 */
.date-input-group {
  display: flex;
  justify-content: space-between;
}

.date-item {
  display: flex;
  flex-direction: column;
  width: 48%;
}

.date-label {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 5px;
}

.date-input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #ffebee;
  font-size: 0.9em;
  text-align: center;
}

/* 체크박스 그리드 (단체명) */
.checkbox-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 15px;
}

/* 체크박스 행 (권역, 수거량) */
.checkbox-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 15px;
}

/* 개별 체크박스 아이템 */
.checkbox-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.95em;
}

.checkbox-input {
  margin-right: 8px;
  /* 기본 체크박스 스타일 */
}

.label-text {
  /* 라벨 텍스트 스타일 */
  white-space: nowrap;
}

.logo-text {
  font-weight: bold;
  color: #007bff; /* COVO 로고 색상 강조 예시 */
}


/* 필터 초기화 버튼 */
.reset-button-container {
  text-align: center;
  padding-top: 10px;
}

.reset-button {
  background: none;
  border: none;

  color: #7886C7;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: color 0.2s;
}

.reset-button:hover {
  color: #4A6ACD;
}
</style>