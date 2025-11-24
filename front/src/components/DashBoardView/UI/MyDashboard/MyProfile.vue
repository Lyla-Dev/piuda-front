<!-- src/components/MyDashboard/MyProfile.vue -->
<template>
  <div class="profile-card">
    <h2>내 프로필</h2>

    <div class="profile-wrapper">
      <img class="profile-img" :src="profileImage" alt="profile" />

      <div class="profile-info">
        <p>• 이름: {{ name }}</p>
        <p>• 활동 시작 날짜: {{ startDate }}</p>
      </div>
    </div>

    <button class="edit-btn">프로필 수정</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

// 실제 데이터가 API라면 props로 받을 수도 있음
const profileImage = ref("/assets/profile_dummy.png");
const name = ref("이민형");
const startDate = ref("2025.11.09");
</script>

<style scoped>
.profile-card {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.profile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-img {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 16px;
}

.profile-info {
  text-align: center;
  font-size: 16px;
  margin-bottom: 16px;
}

.edit-btn {
  margin-top: 8px;
  background: none;
  border: none;
  color: #4b4bff;
  cursor: pointer;
  font-size: 14px;
}
</style>
