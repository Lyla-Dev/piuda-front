<!-- src/pages/MyDashboard.vue -->
<template>
  <div class="dashboard-container">
    <MyProfile />
    <ActivityGallery />
  </div>
</template>

<script setup>
import MyProfile from "@/components/DashBoardView/UI/MyDashboard/MyProfile.vue";
import ActivityGallery from "@/components/DashBoardView/UI/MyDashboard/ActivityGallery.vue";
</script>

<style scoped>
.mypage-wrapper {
  background-color: #f4f6fb;
  min-height: 100vh;
  padding: 20px 0;
}
.dashboard-container {
  display: grid;
  grid-template-columns: 320px 600px;
  gap: 10px;
  padding: 32px;

  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
}
</style>
