<!-- src/components/MyDashboard/ActivityGallery.vue -->
<template>
  <div class="gallery-card">
    <div class="header">
      <h2>활동 갤러리</h2>
      <button class="more-btn">후기 펼쳐보기</button>
    </div>

    <div class="gallery-container">
      <button class="big-image-wrapper" v-if="mainReport">
        <img :src="mainReport.photoUrl" :alt="`report-${mainReport.reportId}`" class="big-image" />
      </button>

      <div class="small-grid">
        <button
          v-for="report in subReports"
          :key="report.reportId"
          class="small-image-wrapper"
        >
          <img :src="report.photoUrl" :alt="`report-${report.reportId}`" class="small-image" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  reports: {
    type: Array,
    default: () => []
  }
});

// 최신 5개의 리포트 (reportId, photoUrl)
const recentReports = computed(() => {
  return props.reports.slice(-5).reverse(); // 최신순으로 최대 5개
});

const mainReport = computed(() => recentReports.value[0]); // 가장 최신 1개
const subReports = computed(() => recentReports.value.slice(1, 5)); // 나머지 4개
</script>

<style scoped>
.gallery-card {
  background: #fff;
  width: 100%;
  padding: 24px;
  border-radius: 30px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.more-btn {
  background: none;
  border: none;
  font-size: 12px;
  color: #2d336b;
  cursor: pointer;
}

.gallery-container {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 8px;
}

.big-image-wrapper {
  width: 240px;
  height: 240px;
  overflow: hidden;
  flex-shrink: 0;
  border-radius: 8px;
}

.big-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.small-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  max-width: 100%;
}

.small-image-wrapper {
  width: 100%;
  height: 116px;
  overflow: hidden;
  border-radius: 8px;
}

.big-image-wrapper,
.small-image-wrapper {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  appearance: none; /* ⭐ Safari, iOS 기본 버튼 스타일 제거 */
  -webkit-appearance: none;
}

.small-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
