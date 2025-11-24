<!-- src/components/MyDashboard/MyProfile.vue -->
<template>
  <div class="profile-card">
    <div class="header">
      <h2>내 프로필</h2>
      <button class="edit-btn">프로필 수정</button>
    </div>

    <div class="profile-content">
      <ProfileImage :src="profileImage" />

      <div class="profile-info">
        <p>• 이름: {{ name }}</p>
        <p>• 활동 시작 날짜: {{ startDate }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import ProfileImage from "@/components/DashBoardView/Components/CropImage.vue";

// 실제 데이터가 API라면 props로 받을 수도 있음
const profileImage = ref(
  new URL("@/assets/profile.jpeg", import.meta.url).href
);
const name = ref("이민형");
const startDate = ref("2025.11.09");
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 24px;
}

.profile-card {
  background: #fff;
  max-width: 100%;
  padding: 24px;
  border-radius: 30px;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-content {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
}

.profile-info {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
}

.profile-info p {
  white-space: nowrap;
}

.edit-btn {
  margin-top: 8px;
  background: none;
  border: none;
  color: #2d336b;
  cursor: pointer;
  font-size: 12px;
}
</style>
