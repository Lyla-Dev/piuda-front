<!-- src/components/MyDashboard/ActivityGallery.vue -->
<template>
  <div class="gallery-card">
    <div class="header">
      <h2>활동 후기 보기</h2>
      <button class="more-btn">후기 펼쳐보기</button>
    </div>

    <div class="gallery-grid">
      <img
        v-for="(img, index) in images"
        :key="index"
        :src="img"
        class="gallery-img"
        alt="activity image"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 추후 API로 교체 가능
const images = ref([
  "/assets/activity_main.jpg",
  "/assets/activity_1.jpg",
  "/assets/activity_2.jpg",
  "/assets/activity_3.jpg",
  "/assets/activity_4.jpg",
]);
</script>

<style scoped>
.gallery-card {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.more-btn {
  background: none;
  border: none;
  font-size: 14px;
  color: #4b4bff;
  cursor: pointer;
}

.gallery-grid {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.gallery-img {
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-radius: 10px;
}
</style>
