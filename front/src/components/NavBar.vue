<template>
  <nav class="navbar">
    <div class="logo">바다살리기 네트워크</div>
    <ul class="nav-links">
      <li><RouterLink to="/">소개</RouterLink></li>
      <li><RouterLink to="/activity">활동</RouterLink></li>
      <li><RouterLink to="/map">해양지도</RouterLink></li>
      <li><RouterLink to="/info">공지</RouterLink></li>
    </ul>
    <RouterLink to="/login">
      <button class="login-btn">Login</button>
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.navbar {
  position: fixed; /* ✅ 화면 상단 고정 */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* ✅ 배경 이미지보다 위 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  color: white;
  background: transparent; /* ✅ 기본은 투명 */
  transition: background-color 0.3s ease;
}

/* ✅ 스크롤 시 배경 흰색으로 바뀌게 (선택사항) */
.navbar.scrolled {
  background-color: rgba(11, 34, 57, 0.95);
}

.logo {
  font-weight: bold;
  font-size: 1.2rem;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 2rem;
  margin: 0;
  padding: 0;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.login-btn {
  background-color: white;
  color: #0b2239;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}
</style>
