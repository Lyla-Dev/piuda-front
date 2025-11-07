<template>
  <div id="app">
    <ActivityFormView /> 
  </div>
</template>

<script>
// import NavBar from './components/NavBar.vue'
import ActivityFormView from './components/ActivityView/ActivityFormView.vue'; 

export default {
  name: 'App',
  components: {
    ActivityFormView
  }
}
</script>

<style>
/* App.vue의 전역 스타일 */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  /* ActivityFormView가 가운데 정렬되도록 전역 스타일을 조정합니다. */
  text-align: center; 
  min-height: 100vh;
  padding: 0;
  margin: 0;
  /* background-color를 App.vue에서 설정하면 ActivityFormView의 배경색이 덮어쓰기 될 수 있어 생략합니다. */
}
</style>