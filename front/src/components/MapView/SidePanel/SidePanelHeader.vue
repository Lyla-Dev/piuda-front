<template>
  <header class="panel-header">
    <div class="panel-title-wrap">
      <p class="panel-badge" :class="badgeClass">
        {{ pinTypeText }}
      </p>

      <p class="panel-coords" v-if="pinDetail">
        위도: {{ (pinDetail.pinY ?? pinDetail.lat)?.toFixed(3) }}, 경도:
        {{ (pinDetail.pinX ?? pinDetail.lng)?.toFixed(3) }}
      </p>
    </div>
    <button class="panel-close-btn" @click="$emit('close')">×</button>
  </header>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  pinDetail: {
    type: Object,
    default: null,
  },
});

defineEmits(["close"]);

const pinTypeText = computed(() => {
  const color = props.pinDetail?.pinColor?.toLowerCase();
  if (color === "red") return "정화필요지역";
  if (color === "blue") return "활동예정지역";
  if (color === "green") return "활동완료지역";
  return "정화필요지역";
});

const badgeClass = computed(() => {
  const color = props.pinDetail?.pinColor?.toLowerCase();

  if (color === "red") return "badge-red";
  if (color === "blue") return "badge-blue";
  if (color === "green") return "badge-green";

  return "badge-red";
});
</script>

<style scoped>
.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 22px 12px;
  background: #f0f1f6;
}

.panel-title-wrap {
  flex: 1;
  min-width: 0;
}

.panel-badge {
  font-size: 22px;
  font-weight: 800;
  color: #ff4d4d;
  margin: 0 0 6px;
}

.panel-coords {
  margin-top: 4px;
  font-size: 12px;
  color: #9a9aa0;
}

.panel-close-btn {
  border: none;
  background: transparent;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  color: #111;
}

.badge-red {
  color: #ff4d4d;
}

.badge-blue {
  color: #2d336b;
}

.badge-green {
  color: #333;
}
</style>
