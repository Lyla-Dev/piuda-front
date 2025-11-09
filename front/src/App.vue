<template>
  <div id="app">
    <!-- 상단 네비게이션 -->
    <NavBar />

    <main :class="{ 'with-padding': !isHome }">
      <router-view />
    </main>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'App',
  components: {
    NavBar
  },
  setup() {
    const route = useRoute()
    const isHome = computed(() => route.path === '/') // ✅ 홈 여부 판단
    return { isHome }
  }
}
</script>

<style>
main {
  display: block;
  width: 100%;
  box-sizing: border-box;
  transition: padding-top 0.3s ease;
}
.with-padding {
  padding-top: 80px;
}

body {
  margin: 0;
  overflow-x: hidden; /* ✅ 전역에서 가로 스크롤 차단 */
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
}
</style>