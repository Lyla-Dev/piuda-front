import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/components/MainView/MainView.vue'
import MapView from '@/components/MapView/MapView.vue'
import InfoView from '@/components/InfoView/InfoView.vue'
import IntroView from '@/components/IntroView/IntroView.vue'
import LoginView from '@/pages/LoginView.vue'
import ReportView from "@/components/ActivityView/ReportView.vue";
import ActivityList from "@/components/ActivityView/ActivityList.vue";
import ActivityForm from "@/pages/ActivityFormView.vue"
import ReviewList from "@/pages/ReviewList.vue"

const routes = [
  { path: '/', name: 'Home', component: MainView },
  { path: '/map', name: 'Map', component: MapView },
  { path: '/info', name: 'Info', component: InfoView },
  { path: '/intro', name: 'Intro', component: IntroView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/report', name: 'Report', component: ReportView },
  { path: '/activity-list', name: 'ActivityList', component: ActivityList}, 
  { path: '/activity-form', name: 'ActivityForm', component: ActivityForm },
  { path: '/review-list', name: 'ReviewList', component: ReviewList }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router