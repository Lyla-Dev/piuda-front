<template>
  <div class="img-cropper">
    <img :src="src" alt="profile" />
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.img-cropper {
  width: 160px; /* 원의 지름 */
  height: 160px; /* 원의 지름 */
  border-radius: 50%; /* 원형 마스크 */
  overflow: hidden; /* 원 밖 영역 제거 */
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f2f2f2; /* 빈 영역 대비 */
}

.img-cropper img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 짧은 변 기준으로 균일 축소 후 원 영역 채우기 */
}
</style>
