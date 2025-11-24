<!-- src/pages/MyDashboard.vue -->
<template>
  <!-- <div class="mypage-wrapper"> -->
  <div class="dashboard-container">
    <MyProfile />
    <ActivityGallery />
  </div>
</template>

<script>
import MyProfile from "@/components/DashBoardView/UI/MyDashboard/MyProfile.vue";
import ActivityGallery from "@/components/DashBoardView/UI/MyDashboard/ActivityGallery.vue";
</script>

<style scoped>
.mypage-wrapper {
  background-color: #f4f6fb; /* 원하는 배경색 */
  min-height: 100vh; /* 화면 전체 채우기 */
  padding: 20px 0; /* 상하 여백 (선택) */
}
.dashboard-container {
  display: grid;
  grid-template-columns: 1fr 2fr; /* 왼쪽 프로필 1, 오른쪽 갤러리 2 */
  gap: 24px;
  padding: 32px;
}
</style>
