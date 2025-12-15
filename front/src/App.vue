<template>
  <div id="app">
    <NavBar v-if="!isAward" />

    <!-- award button removed; navigation via main page FAB (.other-fab) -->

    <main :class="{ 'with-padding': !isHome && !isAward }">
      <router-view />
    </main>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import { computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  name: "App",
  components: {
    NavBar,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isHome = computed(() => route.path === "/");
    const isAward = computed(() => route.path === "/award");

    function handleDocClick(e) {
      const target = e.target && e.target.closest && e.target.closest('.other-fab')
      if (target) {
        router.push('/award')
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleDocClick)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleDocClick)
    })
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

/* Award button removed; styles cleaned */
</style>
