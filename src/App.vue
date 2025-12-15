<template>
  <div id="app">
    <NavBar v-if="!isAward" />

    <div v-if="!isAward" class="award-button-wrap">
      <router-link to="/award" class="award-button">어워드</router-link>
    </div>

    <main :class="{ 'with-padding': !isHome && !isAward }">
      <router-view />
    </main>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";

export default {
  name: "App",
  components: {
    NavBar,
  },
  setup() {
    const route = useRoute();
    const isHome = computed(() => route.path === "/");
    const isAward = computed(() => route.path === "/award");
    return { isHome, isAward };
  },
};
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
  overflow-x: hidden;
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
}

/* Award button styles */
.award-button-wrap {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 1200;
}
.award-button {
  background: #e74c3c;
  color: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
}
.award-button:hover {
  opacity: 0.9;
}
</style>
