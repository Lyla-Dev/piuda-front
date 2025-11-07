<template>
  <div id="app">
    <!-- 상단 네비게이션 -->
    <NavBar />

    <!-- 라우터 뷰 -->
    <router-view />

    <!-- 직접 ActivityFormView를 렌더링하고 싶을 때 사용 -->
    <!-- 필요할 경우 주석 해제 -->
    <!-- <ActivityFormView /> -->
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
// import ActivityFormView from './pages/ActivityFormView.vue'

export default {
  components: {
    NavBar
    // ActivityFormView 
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
}
</style>
