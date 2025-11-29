<template>
  <aside class="map-side-panel" :class="{ 'is-open': props.isOpen }">
    <div class="panel-inner">
      <SidePanelHeader :pin-detail="props.pinDetail" @close="$emit('close')" />

      <div class="panel-scroll">
        <SidePanelActivityInfo :pin-detail="pinDetail" />
        <SidePanelReviews :activity-logs="props.activityLogs" />
      </div>
    </div>
  </aside>
</template>

<script setup>
import SidePanelHeader from "./SidePanelHeader.vue";
import SidePanelActivityInfo from "./ActivitySummary.vue";
import SidePanelReviews from "./SidePanelReviews.vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  pinDetail: {
    type: Object,
    default: null,
  },
  activityLogs: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["close", "register-activity"]);

// const pinDetailTitle = computed(() => {
//   if (!props.pinDetail) return "지역 정보 없음";
//   // notifyContent 앞부분을 제목처럼 사용 (임시)
//   if (props.pinDetail.notifyContent) {
//     return String(props.pinDetail.notifyContent).slice(0, 12) + "...";
//   }
//   return "지역 정보";
// });
</script>

<style scoped>
.map-side-panel {
  position: fixed; /* MapView의 .map-container 가 position:relative 여야 함 */
  top: 93px;
  right: 0;
  height: calc(100vh - 80px);
  width: 420px; /* 오른쪽 패널 폭 넉넉하게 */
  max-width: 100%;
  background: #f0f1f6; /* 전체 연한 회색톤 배경 */
  border-left: 1px solid #f0f1f6; /* 아주 연한 파란 보더 */
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.06);
  transform: translateX(100%);
  transition: transform 0.3s ease-out;
  z-index: 30;
  display: flex;
}

/* isOpen=true 일 때 오른쪽에서 슬라이드 인 */
.map-side-panel.is-open {
  transform: translateX(0);
}

.panel-inner {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.panel-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 12px 22px 24px;
}

.stats-value {
  color: #333;
  font-weight: 600;
}

/* ── 활동 등록하기 버튼 ─────────────────── */

.register-btn {
  display: block;
  width: 80%; /* 가운데 꽉 찬 느낌 */
  max-width: 260px;
  margin: 14px auto 0; /* 가운데 정렬 */
  border-radius: 999px;
  border: none;
  padding: 11px 0;
  background: #f7a5a5; /* 핑크 버튼 */
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

/* 모바일에서 전체 폭 차지 */
@media (max-width: 768px) {
  .map-side-panel {
    position: fixed;
    top: 80px; /* 상단 헤더 높이에 맞춰 조정 */
    right: 0;
    width: 100%;
    height: calc(100vh - 80px);
  }
}
</style>
