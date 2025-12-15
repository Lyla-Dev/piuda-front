<!-- src/pages/MyDashboard.vue -->
<template>
  <div class="dashboard-wrapper">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>데이터를 불러오는 중...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>❌ {{ error }}</p>
      <button @click="fetchDashboardData" class="retry-btn">다시 시도</button>
    </div>

    <div v-else class="content-wrapper">
      <div class="dashboard-container">
        <MyProfile :userName="dashboardData.userName" :startDate="formattedCreatedAt" />
        <ActivityGallery :reports="dashboardData.reports || []" />
      </div>
      <div class="chart-section">
        <MonthlyActivityChart :monthlyData="monthlyData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import MyProfile from "@/components/DashBoardView/UI/MyDashboard/MyProfile.vue";
import ActivityGallery from "@/components/DashBoardView/UI/MyDashboard/ActivityGallery.vue";
import MonthlyActivityChart from "@/components/DashBoardView/UI/MyDashboard/MonthlyActivityChart.vue";
import http from '@/api/http';

const router = useRouter();
const loading = ref(true);
const error = ref(null);
const dashboardData = ref({});
const monthlyData = ref([]);

// createdAt을 YYYY-MM-DD 형식으로 변환
const formattedCreatedAt = computed(() => {
  const createdAt = dashboardData.value.createdAt;
  if (!createdAt) return '';
  
  // "2025-12-15T06:50:23.730833" -> "2025-12-15"
  return createdAt.split('T')[0];
});

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await http.get('/dashboard/private');
    dashboardData.value = response.data;

    // monthlyStats를 현재 연도 데이터로 변환
    const currentYear = new Date().getFullYear();
    monthlyData.value = (response.data.monthlyStats || []).map(stat => ({
      year: currentYear,
      month: stat.month,
      reportCount: stat.activityCount
    }));

  } catch (err) {
    if (err.response?.status === 401) {
      error.value = '로그인이 필요합니다.';
      router.push('/login');
    } else {
      error.value = err.response?.data?.message || '데이터를 불러오는데 실패했습니다.';
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.dashboard-wrapper {
  background-color: #f4f6fb;
  min-height: 100vh;
  padding: 20px 0;
}

.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px;
}

.dashboard-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.chart-section {
  width: 100%;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  background-color: #2563eb;
}
</style>
