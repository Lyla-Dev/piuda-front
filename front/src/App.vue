<template>
  <div id="app">
    <NavBar />
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
export default {
  components: { NavBar }
}
</script>

<style>
body {
  margin: 0;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
}
</style>
