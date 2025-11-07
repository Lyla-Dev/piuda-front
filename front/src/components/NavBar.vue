<template>
  <nav :class="['navbar', { 'navbar--solid': !isHome }]">
    <!-- 로고 -->
    <div class="logo">
      <router-link to="/" class="logo-link">
        <img
          :src="isHome ? require('@/assets/logo.png') : require('@/assets/logo_navy.png')"
          alt="로고"
        />
      </router-link>
    </div>

    <!-- 메뉴 -->
    <ul class="menu">
      <li><router-link to="/intro">소개</router-link></li>

      <!-- 활동 (드롭다운) -->
      <li
        class="dropdown"
        @mouseenter="showDropdown = true"
        @mouseleave="showDropdown = false"
      >
        <span>활동</span>

        <transition name="fade">
          <ul v-if="showDropdown" class="dropdown-menu">
            <li>
              <router-link to="/report">해양 쓰레기 제보</router-link>
            </li>
            <li>
              <router-link to="/review-list">활동 후기 게시판</router-link>
            </li>
          </ul>
        </transition>
      </li>

      <li><router-link to="/map">해양 지도</router-link></li>
      <li><router-link to="/info">공지</router-link></li>
    </ul>

    <!-- 로그인 버튼 -->
    <div class="login">
      <router-link to="/login">Login</router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch } from "vue"
import { useRoute } from "vue-router"

const showDropdown = ref(false)
const route = useRoute()

const isHome = ref(true) // ✅ 반응형으로 관리

watch(
  () => route.path,
  (newPath) => {
    isHome.value = newPath === "/"
  },
  { immediate: true } // 첫 렌더링 시 즉시 적용
)
</script>

<style scoped>
/* ===== 기본 네비게이션 구조 ===== */
.navbar {
  position: absolute;
  top: 0;
  width: 100%;
  padding: 1.2rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  z-index: 10;
}

/* ====== 흰 배경 + 남색 텍스트 ====== */
.navbar--solid {
  background: white;
  color: #1a2b6d;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.navbar--solid .menu a,
.navbar--solid .menu span,
.navbar--solid .login a {
  color: #1a2b6d !important; /* ✅ 덮어쓰기 */
}

.navbar--solid .menu a:hover,
.navbar--solid .menu span:hover,
.navbar--solid .login a:hover {
  color: #5060b5 !important;
}

/* 로고 */
.logo {
  display: flex;
  align-items: center;
}
.logo img {
  height: 50px;
  margin-right: 0.5rem;
}
.logo span {
  font-weight: 600;
  font-size: 1rem;
}

/* 메뉴 */
.menu {
  list-style: none;
  display: flex;
  gap: 2rem;
  align-items: center;
  margin: 0;
  padding: 0;
}
.menu li {
  position: relative;
  cursor: pointer;
}
.menu a,
.menu span {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: 0.2s;
}
.menu a:hover,
.menu span:hover {
  color: #cfd8ff;
}

/* ===== 드롭다운 메뉴 ===== */
.dropdown-menu {
  position: absolute;
  top: 2.2rem;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  list-style: none;
  padding: 0.5rem 0;
  width: 170px;
  text-align: center;
}
.dropdown-menu li {
  padding: 0.6rem 1rem;
}
.dropdown-menu li a {
  color: #333;
  font-size: 0.95rem;
  text-decoration: none;
}
.dropdown-menu li a:hover {
  color: #1a2b6d;
  font-weight: 600;
}

/* ===== 페이드 전환 ===== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ===== 로그인 버튼 ===== */
.login a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  margin-right: 4rem;
}
.login a:hover {
  color: #cfd8ff;
}
</style>
