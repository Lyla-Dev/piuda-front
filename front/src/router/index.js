import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/components/MainView/MainView.vue'
import ActivityView from '@/components/ActivityView/ActivityView.vue'
import MapView from '@/components/MapView/MapView.vue'
import InfoView from '@/components/InfoView/InfoView.vue'
import LoginView from '@/pages/LoginView.vue'
// import ReviewList from '@/pages/ReviewList.vue' // 🚨 오류 해결을 위해 주석 처리

const routes = [
  { path: '/', name: 'Home', component: MainView },
  { path: '/activity', name: 'Activity', component: ActivityView },
  { path: '/map', name: 'Map', component: MapView },
  { path: '/info', name: 'Notice', component: InfoView },
  { path: '/login', name: 'Login', component: LoginView },

  // { path: '/reviews', name: 'ReviewList',component: ReviewList } // 🚨 오류 해결을 위해 주석 처리
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router