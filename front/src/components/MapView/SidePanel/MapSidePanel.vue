<template>
  <aside class="map-side-panel" :class="{ 'is-open': props.isOpen }">
    <div class="panel-inner">
      <SidePanelHeader :pin-detail="props.pinDetail" @close="$emit('close')" />

      <div class="panel-scroll">
        <SidePanelActivityInfo :pin-detail="pinDetail" />
        <SidePanelReviews :review-logs="props.reviewLogs" />
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
  reviewLogs: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["close", "register-activity"]);
</script>

<style scoped>
.map-side-panel {
  position: fixed;
  top: 93px;
  right: 0;
  height: calc(100vh - 80px);
  width: 420px;
  max-width: 100%;
  background: #f0f1f6;
  border-left: 1px solid #f0f1f6;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.06);
  transform: translateX(100%);
  transition: transform 0.3s ease-out;
  z-index: 30;
  display: flex;
}

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
  padding: 0px 22px 0px;
}

.stats-value {
  color: #333;
  font-weight: 600;
}

/* ── 활동 등록하기 버튼 ─────────────────── */
.register-btn {
  display: block;
  width: 80%;
  max-width: 260px;
  margin: 14px auto 0;
  border-radius: 999px;
  border: none;
  padding: 11px 0;
  background: #f7a5a5;
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 768px) {
  .map-side-panel {
    position: fixed;
    top: 80px;
    right: 0;
    width: 100%;
    height: calc(100vh - 80px);
  }
}
</style>
