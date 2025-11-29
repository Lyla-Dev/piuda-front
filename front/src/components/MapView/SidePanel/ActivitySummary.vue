<template>
  <section class="section">
    <h3 class="section-title">활동 정보</h3>

    <ul class="stats-list">
      <!-- 최근 활동 -->
      <li class="stats-item">
        <span class="stats-icon">
          <img :src="peopleIcon" alt="최근 활동" class="stats-img" />
        </span>
        <div class="stats-text">
          <span class="stats-label">최근 활동:</span>
          <span class="stats-value">{{
            props.pinDetail?.latestActivityDate || "-"
          }}</span>
        </div>
      </li>

      <!-- 누적 수거량 -->
      <li class="stats-item">
        <span class="stats-icon">
          <img :src="clockIcon" alt="누적 수거량" class="stats-img" />
        </span>
        <div class="stats-text">
          <span class="stats-label">누적 수거량:</span>
          <span class="stats-value">
            {{ pinDetail?.totalTrashKg || "-" }} kg
          </span>
        </div>
      </li>

      <!-- 누적 활동 횟수 -->
      <li class="stats-item">
        <span class="stats-icon">
          <img :src="sharpIcon" alt="누적 활동 횟수" class="stats-img" />
        </span>
        <div class="stats-text">
          <span class="stats-label">누적 활동 횟수:</span>
          <span class="stats-value">
            {{ pinDetail?.activityCount || "-" }}
          </span>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import peopleIcon from "@/assets/people.png";
import clockIcon from "@/assets/clock.png";
import sharpIcon from "@/assets/sharp.png";

const props = defineProps({
  pinDetail: {
    type: Object,
    default: null,
  },
});
</script>

<style scoped>
.section-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
}

.stats-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}

.stats-item {
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.stats-item + .stats-item {
  margin-top: 4px;
}

.stats-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}

.stats-img {
  width: 20px;
  height: 15px;
  object-fit: contain;
}

.stats-text {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 13px;
}

.stats-label {
  color: #555;
  margin-right: 4px;
}

.stats-value {
  color: #333;
  font-weight: 600;
}
</style>
