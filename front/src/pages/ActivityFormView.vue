<template>
  <div class="form-wrapper">
    
    <!-- ⭐️ [핵심 수정] 폼 최상단에 '해양 쓰레기 수거 활동 후기' 제목을 다시 추가합니다. ⭐️ -->
    <h1 class="page-header">해양 쓰레기 수거 활동 후기</h1>
    
    <!-- 1. 인원 정보 섹션: 3열 레이아웃 적용 -->
    <section class="section-card">
      <h3 class="section-title">인원 정보</h3>
      
      <!-- [수정 적용] '작성자', '활동인원 수', '단체명'을 3열로 묶는 그룹 -->
      <div class="input-group-triple">
        <InputField label="작성자" v-model="form.writer" required placeholder="홍길동" />
        <InputField label="활동인원 수" v-model="form.count" required type="number" placeholder="0명" />
        <InputField label="단체명" v-model="form.groupname" placeholder="단체/동아리 이름" />
      </div>
      
      <!-- '활동 제목'은 단독 줄로 배치 -->
      <div class="input-group">
        <InputField label="활동 제목" v-model="form.title" required placeholder="예: 제주바당" />
      </div>
    </section>

    <!-- 2. 활동 위치 및 시간 섹션 -->
    <section class="section-card">
      <h3 class="section-title">활동 위치 및 시간</h3>
      
      <div class="input-group">
        <label class="input-label required">활동 날짜 *</label>
        <select class="custom-select" v-model="form.date">
          <option value="">날짜 및 시간 선택</option>
          <option value="2025-11-05">2025-11-05</option>
        </select>
      </div>

      <div class="input-group">
        <label class="input-label">활동 위치 *</label>
        <div class="map-placeholder">
            지도 영역
        </div>
        <p class="map-coords">좌표: (130.0000, 12323)</p>
      </div>

      <div class="input-group">
        <InputField label="상세 위치" v-model="form.detailLocation" placeholder="예: 고성 공원리 해변 일대" />
      </div>
    </section>

    <!-- 3. 쓰레기 정보 섹션 -->
    <section class="section-card">
      <h3 class="section-title">쓰레기 정보</h3>
      
      <div class="input-group-inline">
        <InputField label="총 쓰레기 양 (무게)" v-model="form.weight" placeholder="0" unit="kg" />
        <InputField label="총 쓰레기 양 (부피)" v-model="form.volume" placeholder="0" unit="L" />
      </div>
      
      <div class="trash-type-container">
        <p class="trash-prompt">수거한 쓰레기 종류 * (해당되는 모든 항목 선택, 개수 입력)</p>
        <div class="checkbox-placeholder">
          플라스틱 병, 캔, 박스, 부표, 유리병, 밧줄 등...
        </div>
      </div>
    </section>

    <!-- 4. 현장 사진 및 기록 섹션 -->
    <section class="section-card">
      <h3 class="section-title">현장 사진 및 기록</h3>
      
      <div class="input-group">
        <label class="input-label">사진 첨부</label>
        <div class="photo-placeholder">사진 업로드 영역 (최대 10MB, JPG/PNG)</div>
      </div>

      <div class="input-group">
        <label class="input-label">기록 (최대 2000자)</label>
        <textarea class="custom-textarea" v-model="form.memo" placeholder="환경 변화, 느낀 점 등을 자유롭게 작성해주세요."></textarea>
      </div>
    </section>

    <!-- 5. 제출 버튼 영역 -->
    <div class="submit-area">
      <button class="submit-button" @click="handleSubmit">
        후기 등록하기
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
// 경로가 맞는지 다시 한번 확인해주세요. (일반적으로 src/components/common/InputField.vue)
import InputField from '../components/common/InputField.vue'; 

const form = ref({
  // 인원 정보
  writer: '',
  title: '',
  count: 0,
  groupname: '',

  // 활동 위치 및 시간
  date: '',
  detailLocation: '', 

  // 쓰레기 정보
  weight: '',
  volume: '',

  // 현장 사진 및 기록
  memo: '',
});

const handleSubmit = () => {
  console.log('폼 제출:', form.value);
  // 여기에 데이터를 서버로 전송하는 로직을 구현합니다.
};

</script>

<style scoped>
/* A. 전체 컨테이너 및 섹션 스타일 */
.form-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #F4F5F8; 
}

/* ⭐️ 페이지 최상단 제목 스타일 (강조) ⭐️ */
.page-header {
    font-size: 2.2rem; /* 크기 약간 키움 */
    font-weight: 500; /* 더 두껍게 */
    color: #333; /* 제목 색상 */
    margin-bottom: 30px; /* 아래 섹션과의 간격 확장 */
    padding-bottom: 15px; /* 제목 아래에 약간의 여백 확장 */
}

.section-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #343A6A;
  margin-bottom: 20px;
  border-bottom: 1.5px solid #343A6A; /* 파란색 밑줄로 강조 */
  padding-left: 10px;
}

/* B. InputField 및 입력 요소 스타일 */

/* 입력 그룹 스타일 (단독 줄) */
.input-group {
  margin-bottom: 20px;
}

/* 2열 레이아웃을 위한 인라인 그룹 (쓰레기 정보 섹션 등) */
.input-group-inline {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.input-group-inline .input-group,
.input-group-inline > :deep(.input-field-wrapper) {
  flex: 1; 
}

/* ⭐️ 3열 레이아웃을 위한 새로운 인라인 그룹 (인원 정보 섹션) ⭐️ */
.input-group-triple {
    display: flex; /* Flexbox 활성화 */
    gap: 15px; /* 항목 간 간격 조정 */
    margin-bottom: 20px;
}

/* 3열 레이아웃의 자식 요소들이 동일한 너비를 갖도록 설정 */
.input-group-triple > :deep(.input-field-wrapper), 
.input-group-triple > * {
    flex: 1; /* 모든 자식 요소가 동일한 비율로 공간을 나눔 */
    min-width: 0; 
}


/* InputField 라벨에 대한 스타일 */
.input-label {
    display: block;
    font-size: 1rem;
    font-weight: 500;
    color: #444;
    margin-bottom: 8px;
}

.required::after {
    content: " *";
    color: red;
}

/* C. 커스텀 입력 요소 (맵, 셀렉트, 텍스트 영역) */

.map-placeholder {
  height: 200px;
  background: #eee;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666;
  border-radius: 4px;
  margin-bottom: 10px;
}

.map-coords {
    font-size: 0.85rem;
    color: #888;
    margin-top: -5px;
    margin-bottom: 15px;
}

.custom-select, .custom-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px; 
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.custom-textarea {
  min-height: 120px;
  resize: vertical;
}

/* D. 쓰레기 정보 임시 레이아웃 */
.trash-type-container {
    padding: 15px;
    border: 1px solid #eee;
    background-color: #f9f9f9;
    border-radius: 4px;
}
.trash-prompt {
    font-weight: 500;
    margin-bottom: 10px;
    font-size: 0.95rem;
}
.checkbox-placeholder {
    color: #999;
    font-size: 0.9rem;
    padding: 5px 0;
}

/* E. 사진 첨부 임시 레이아웃 */
.photo-placeholder {
    height: 60px;
    background: #f0f0f0;
    border: 2px dashed #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #999;
    border-radius: 4px;
}


/* F. 제출 버튼 */
.submit-area {
  padding: 20px 0;
  text-align: center;
}

.submit-button {
  background-color: #213547; /* 어두운 색 버튼 */
  color: white;
  border: none;
  padding: 15px 40px;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #34495e;
}
</style>