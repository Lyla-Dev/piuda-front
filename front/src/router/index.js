import { createRouter, createWebHistory } from "vue-router";
import MainView from "@/components/MainView/MainView.vue";
import MapView from "@/components/MapView/MapView.vue";
import InfoView from "@/components/InfoView/InfoView.vue";
import IntroView from "@/components/IntroView/IntroView.vue";
import ReportView from "@/components/ActivityView/ReportView.vue";
import ActivityList from "@/components/ActivityView/ActivityList.vue";
import ReviewForm from "@/components/ActivityView/ReviewFormView.vue";
import LoginView from "@/components/LoginView/LoginView.vue";
import ReviewList from "@/components/ActivityView/ReviewList.vue";
import MyDashboard from "@/components/DashBoardView/UI/MyDashboard.vue";
import CorpsDashboard from "@/components/DashBoardView/UI/CorpsDashboard.vue";
import ManagerDashboard from "@/components/DashBoardView/UI/ManagerDashboard.vue";
import SignUpView from "@/components/SignUpView/SignUpView.vue";



const routes = [
  { path: "/", name: "Home", component: MainView },
  { path: "/map", name: "Map", component: MapView },
  { path: "/info", name: "Info", component: InfoView },
  { path: "/intro", name: "Intro", component: IntroView },
  { path: "/login", name: "Login", component: LoginView },
  { path: "/report", name: "Report", component: ReportView },
  { path: "/activity-list", name: "ActivityList", component: ActivityList },
  { path: "/review-form", name: "ReviewForm", component: ReviewForm },
  { path: "/review-list", name: "ReviewList", component: ReviewList },
  { path: "/my-dashboard", name: "MyDashboard", component: MyDashboard },
  {
    path: "/corps-dashboard",
    name: "CorpsDashboard",
    component: CorpsDashboard,
  },
  {
    path: "/manager-dashboard",
    name: "ManagerDashboard",
    component: ManagerDashboard,
  },
  {
  path: "/register",
  name: "Register",
  component: SignUpView,
},

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
