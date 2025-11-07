import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/components/MainView/MainView.vue'
import MapView from '@/components/MapView/MapView.vue'
import InfoView from '@/components/InfoView/InfoView.vue'
import IntroView from '@/components/IntroView/IntroView.vue'
import LoginView from '@/components/LoginView/LoginView.vue'
import ReportView from "@/components/ActivityView/ReportView.vue";
import ActivityBoard from "@/components/ActivityView/ActivityBoard.vue";
import ActivityForm from "@/pages/ActivityFormView.vue"
import ActivityList from "@/components/ActivityView/ActivityList.vue"

const routes = [
  { path: '/', name: 'Home', component: MainView },
  { path: '/map', name: 'Map', component: MapView },
  { path: '/info', name: 'Notice', component: InfoView },
  { path: '/intro', name: 'Intro', component: IntroView },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/report', name: 'Report', component: ReportView },
  { path: '/activity-board', name: 'ActivityBoard', component: ActivityBoard}, 
  { path: '/activity-form', name: 'ActivityForm', component: ActivityForm },
  { path: '/activity-list', name: 'ActivityList', component: ActivityList }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router