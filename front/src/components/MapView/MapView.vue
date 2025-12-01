<template>
  <div class="map-container">
    <div id="naverMap" class="map"></div>
    <MapSidePanel
      :is-open="!!selectedPin"
      :pin-detail="selectedPin"
      :review-logs="reviewLogs"
      @close="closeModal"
      @register-activity="openActivityRegisterForm"
    />

    <MapFilterPanel
      :filters="filters"
      @update:filters="onFiltersUpdate"
      :on-reset="resetFilters"
    />

    <button
      class="locate-btn"
      :class="{ shifted: !!selectedPin }"
      @click="moveToMyLocation"
    >
      <img src="@/assets/location.png" alt="내 위치" class="locate-icon" />
    </button>
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
  selectedPin,
  loadNaverMapAPI,
  initializeMap,
  resetFilters,
  closeModal,
} = useMapLogic();

const onFiltersUpdate = ({ key, value }) => {
  if (key === "orgs") {
    Object.assign(filters.orgs, value);
  } else if (key === "quantity") {
    Object.assign(filters.quantity, value);
  } else {
    filters[key] = value;
  }
};

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

const moveToMyLocation = () => {
  if (!navigator.geolocation) {
    alert("현재 브라우저에서는 위치 정보를 사용할 수 없습니다.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;

      if (map.value) {
        map.value.setCenter(new window.naver.maps.LatLng(latitude, longitude));
        map.value.setZoom(12);
      }
    },
    (err) => {
      console.error("위치 정보 가져오기 실패:", err);
      alert("위치 정보를 가져오지 못했습니다.");
    }
  );
};
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
/* .pin-info-modal {
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
} */

.locate-btn {
  position: absolute;
  top: 35px;
  right: 20px;
  z-index: 2000;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  border: 1px solid #ddd;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.34s ease;
  padding: 0;
}

.locate-btn img.locate-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  pointer-events: none;
}

.locate-btn.shifted {
  transform: translateX(-360px);
}

.locate-btn.shifted {
  transform: translateX(-420px);
}
</style>
