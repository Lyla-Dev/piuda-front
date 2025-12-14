<template>
  <nav :class="['navbar', { 'navbar--solid': !isHome }]">
    <div class="logo">
      <router-link to="/" class="logo-link">
        <img
          :src="
            isHome
              ? require('@/assets/logo.png')
              : require('@/assets/logo_navy.png')
          "
          alt="로고"
        />
      </router-link>
    </div>

    <ul class="menu">
      <li><router-link to="/intro">소개</router-link></li>
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

    <div class="auth-section">
      <div v-if="!isLoggedIn" class="login">
        <router-link to="/login">Login</router-link>
      </div>

      <div v-else class="user-info">
        <span class="username">{{ userName }}님</span>
        <button @click="goToDashboard" class="dashboard-btn">대시보드</button>
        <button @click="logout" class="logout-btn">로그아웃</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { authAPI } from "@/api/auth";

const showDropdown = ref(false);
const route = useRoute();
const router = useRouter();

const isHome = ref(true);
const isLoggedIn = ref(false);
const currentUser = ref(null);
const userName = ref("");

const checkAuthStatus = () => {
  isLoggedIn.value = authAPI.isLoggedIn();
  currentUser.value = authAPI.getCurrentUser();

  if (currentUser.value) {
    userName.value =
      currentUser.value.userName ||
      currentUser.value.email?.split("@")[0] ||
      "사용자";
  }
};

const goToDashboard = () => {
  const role = currentUser.value?.role;

  if (role === "ADMIN") {
    router.push("/manager-dashboard");
  } else if (role === "GROUP") {
    router.push("/corps-dashboard");
  } else if (role === "PRIVATE") {
    router.push("/my-dashboard");
  } else {
    // 기본값: 개인 대시보드
    router.push("/my-dashboard");
  }
};

const logout = () => {
  const result = authAPI.logout();
  alert(result.message);

  isLoggedIn.value = false;
  currentUser.value = null;
  userName.value = "";

  router.push("/");
};

watch(
  () => route.path,
  (newPath) => {
    isHome.value = newPath === "/";
    checkAuthStatus();
  },
  { immediate: true }
);

onMounted(() => {
  checkAuthStatus();
});
</script>

<style scoped>
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

.navbar--solid {
  background: white;
  color: #1a2b6d;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.navbar--solid .menu a,
.navbar--solid .menu span,
.navbar--solid .login a {
  color: #1a2b6d !important;
}

.navbar--solid .menu a:hover,
.navbar--solid .menu span:hover,
.navbar--solid .login a:hover {
  color: #5060b5 !important;
}

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

.menu {
  list-style: none;
  display: flex;
  gap: 5rem;
  align-items: center;
  /* margin: 0; */
  margin-right: 40px;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.auth-section {
  margin-right: 4rem;
}

.login a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}
.login a:hover {
  color: #cfd8ff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
}

.dashboard-btn,
.logout-btn {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dashboard-btn:hover,
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.navbar--solid .username {
  color: #1a2b6d !important;
}

.navbar--solid .dashboard-btn,
.navbar--solid .logout-btn {
  border-color: rgba(26, 43, 109, 0.3);
  color: #1a2b6d !important;
}

.navbar--solid .dashboard-btn:hover,
.navbar--solid .logout-btn:hover {
  background: rgba(26, 43, 109, 0.1);
  border-color: rgba(26, 43, 109, 0.5);
}
</style>
