<template>
  <div class="page">
    <h1 class="page-title">해양 쓰레기 수거 활동 후기</h1>

    <!-- 인원 정보 -->
    <section class="card">
      <h2 class="card-title">인원 정보</h2>
      <div class="grid grid-3">
        <InputField v-model="form.writer" label="작성자" required placeholder="김OO" />
        <InputField v-model="form.memberCount" label="활동인원 수" type="number" unit="명" required />
        <InputField v-model="form.org" label="단체명" required placeholder="단체명" />
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

      <!-- 지도 자리 (추후 지도 SDK로 교체) -->
      <div class="map">
        <div class="map-placeholder">지도 영역 (SDK 연동 예정)</div>
      </div>

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

    <div class="actions">
      <button class="primary" @click="submit">후기 등록하기</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InputField from '@/components/common/InputField.vue' // 경로 맞게 조정

const form = ref({
  writer: '',
  memberCount: '',
  org: '',
  title: '',
  date: '',
  placeName: '',
  detailAddress: '',
  totalWeight: '',
  totalVolume: '',
  note: '',
  categoryCounts: {}, // { key: number }
})
const coords = ref({ lng: 130.0, lat: 12.3232 }) // 지도 연동 시 업데이트

const dateOptions = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date()
  d.setDate(d.getDate() - i)
  return d.toISOString().slice(0, 10)
})

const categories = [
  { key: 'plasticBag', label: '플라스틱 봉' },
  { key: 'can', label: '캔류' },
  { key: 'box', label: '박스' },
  { key: 'buoy', label: '부표' },
  { key: 'fishingGear', label: '어망/어구류' },
  { key: 'glass', label: '유리병' },
  { key: 'styro', label: '스티로폼' },
  { key: 'wood', label: '목재' },
  { key: 'textile', label: '의류' },
  { key: 'eWaste', label: '전자제품' },
  { key: 'others', label: '기타 폐기물' },
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

function submit() {
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

  // 전송 payload 예시
  const payload = {
    ...form.value,
    coords: coords.value,
    selectedCategories: selectedCats.value,
  }
  console.log('SUBMIT', payload)
  alert('제출 완료! (콘솔 확인)')
}
</script>

<style scoped>
/* Layout */
.page {
  background: #eef1f7;
  min-height: 100vh;
  padding: 32px 20px 80px;
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
.map-placeholder {
  height: 220px;
  border: 1px dashed #c7cdd8;
  border-radius: 12px;
  display: grid;
  place-items: center;
  color: #6b7280;
  background: #f9fafb;
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
}
.primary:hover { filter: brightness(0.95); }
</style>
