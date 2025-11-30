<!-- src/components/MyDashboard/ActivityGallery.vue -->
<template>
  <div class="gallery-card">
    <div class="header">
      <h2>활동 후기 보기</h2>
      <button class="more-btn">후기 펼쳐보기</button>
    </div>

    <div class="gallery-container">
      <button class="big-image-wrapper" v-if="mainImage">
        <img :src="mainImage" alt="main" class="big-image" />
      </button>

      <div class="small-grid">
        <button
          v-for="(img, index) in subImages"
          :key="index"
          class="small-image-wrapper"
        >
          <img :src="img" class="small-image" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const images = [
  new URL("@/assets/reviewImageEx.png", import.meta.url).href,
  new URL("@/assets/reviewImageEx.png", import.meta.url).href,
  new URL("@/assets/reviewImageEx.png", import.meta.url).href,
  new URL("@/assets/reviewImageEx.png", import.meta.url).href,
  new URL("@/assets/reviewImageEx.png", import.meta.url).href,
];

const mainImage = computed(() => images.at(-1)); // 최신 1장
const subImages = computed(() => images.slice(-5, -1).reverse());
</script>

<style scoped>
.gallery-card {
  background: #fff;
  max-width: 900px;
  margin: 0 auto;
  padding: 25px;
  border-radius: 30px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
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
  grid-template-columns: 260px 1fr;
  gap: 2px;
}

.big-image-wrapper {
  width: 260px;
  height: 260px;
  overflow: hidden;
  flex-shrink: 0;
}

.big-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.small-grid {
  display: grid;
  grid-template-columns: repeat(2, 125px);
  grid-template-rows: repeat(2, 125x);
  gap: 2px;
}

.small-image-wrapper {
  width: 125px;
  height: 128px;
  overflow: hidden;
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
