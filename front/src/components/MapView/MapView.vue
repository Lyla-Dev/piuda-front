<template>
  <div class="map-container">
    <div id="naverMap" class="map"></div>

    <!-- 핀 정보 모달 -->
    <!-- <div v-if="selectedPin" class="pin-info-modal" @click="closeModal">
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
    </div> -->

    <MapSidePanel
      :is-open="!!selectedPin"
      :pin-detail="selectedPin"
      :review-logs="reviewLogs"
      @close="closeModal"
      @register-activity="openActivityRegisterForm"
    />

    <!-- 필터 패널 컴포넌트 -->
    <MapFilterPanel v-model:filters="filters" :on-reset="resetFilters" />
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount } from "vue";
import { useMapLogic } from "./MapLogic";
import MapFilterPanel from "./MapFilters/MapFilterPanel.vue";
import MapSidePanel from "./SidePanel/MapSidePanel.vue";

const {
  map,
  filters,
  loadNaverMapAPI,
  initializeMap,
  resetFilters,
  selectedPin,
  // selectedPinImageUrl,
  closeModal,
} = useMapLogic();

// 사이드바 "활동 등록하기" 버튼용 임시 함수
const openActivityRegisterForm = () => {
  console.log("활동 등록하기 클릭"); // 나중에 모달 열기 등으로 교체
};

const reviewLogs = computed(() => {
  if (!selectedPin.value) return [];

  return (
    selectedPin.value.reports?.map((r) => ({
      id: r.reportId,
      title: r.reportTitle,
      date: r.reportDate,
      orgName: r.reportName,
      description: r.reportContent || "",
      thumbnailUrl: r.photoPaths?.[0] || null,
    })) || []
  );
});

onMounted(async () => {
  try {
    await loadNaverMapAPI();
    initializeMap();
  } catch (error) {
    console.error("네이버 지도 API 로드 실패:", error);
  }
});

onBeforeUnmount(() => {
  if (map.value) {
    map.value.destroy();
  }
});
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

/* .pin-info-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
} */

/* .close-btn {
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
} */

/* .close-btn:hover {
  background: #f0f0f0;
} */

/* .pin-title {
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 700;
  color: #2f327d;
}

.pin-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
} */

/* .coords {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
} */

/* .notify-content {
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
/* } */
</style>
