<template>
  <div class="corps-wrapper">
    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>데이터를 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="error-state">
      <p>❌ {{ error }}</p>
      <button @click="fetchDashboardData" class="retry-btn">다시 시도</button>
    </div>

    <!-- 데이터 표시 -->
    <template v-else>
      <!-- 상단 통계 카드 -->
      <div class="stats-row">
        <ResultCard
          title="누적 참여 인원"
          :delta="0"
          :result="dashboardData.accumPeople || 0"
          unit="명"
        />
        <ResultCard
          title="누적 폐기물 kg"
          :delta="0"
          :result="dashboardData.accumKg || 0"
          unit="kg"
        />
        <ResultCard
          title="누적 폐기물 L"
          :delta="0"
          :result="dashboardData.accumL || 0"
          unit="L"
        />
        <ResultCard
          title="누적 활동 횟수"
          :delta="0"
          :result="dashboardData.accumAct || 0"
          unit="번"
        />
        
        <button 
          class="excel-download-btn"
          @click="downloadExcel"
          :disabled="loading"
        >
          <span class="excel-icon">📊</span>
          원자료 엑셀 다운로드
        </button>
      </div>

      <!-- 그래프 카드 -->
      <GraphCard
        :monthlyStats="dashboardData.monthlyStats"
        :trashData="dashboardData"
      />

      <!-- 리스트 카드 -->
      <ListCard
        title="작성된 후기"
        :columns="[
          { label: '제목', key: 'title' },
          { label: '날짜', key: 'date' },
          { label: '작성자', key: 'writer' },
          { label: '참여 인원', key: 'people' },
        ]"
        :contents="formattedReports"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import http from '@/api/http';
import ResultCard from '@/components/DashBoardView/Components/ResultCard.vue';
import ListCard from '@/components/DashBoardView/Components/ListCard.vue';
import GraphCard from '@/components/DashBoardView/Components/GraphCard.vue';

const loading = ref(true);
const error = ref(null);
const dashboardData = ref(null);

const formattedReports = computed(() => {
  if (!dashboardData.value?.reports) return [];
  
  return dashboardData.value.reports.map(report => {
    const title = report.title || report.reportTitle || report.report_title || '제목 없음';
    const writer = report.userName || report.writer || report.reportName || report.report_name || '작성자 없음';
    const people = report.people || report.reportPeople || report.report_people || report.memberCount || 0;
    
    let formattedDate = '날짜 없음';
    const dateField = report.date || report.reportDate || report.report_date || report.createdAt || report.created_at;
    
    if (dateField) {
      try {
        const dateObj = new Date(dateField);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toLocaleDateString('ko-KR');
        } else {
          formattedDate = dateField.toString();
        }
      } catch (e) {
        formattedDate = dateField.toString();
      }
    }
    
    return {
      title,
      date: formattedDate,
      writer,
      people,
    };
  });
});

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await http.get('/dashboard/org');
    dashboardData.value = response.data;
  } catch (err) {
    if (err.response?.status === 400 && err.response?.data?.message?.includes('누적 데이터')) {
      dashboardData.value = {
        accumPeople: 0,
        accumKg: 0,
        accumL: 0,
        accumAct: 0,
        accumTrashGeneral: 0,
        accumTrashCan: 0,
        accumTrashGlass: 0,
        accumTrashMetal: 0,
        accumTrashPaper: 0,
        accumTrashPlastic: 0,
        accumTrashStyrofoam: 0,
        accumTrashVinyl: 0,
        accumTrashEtc: 0,
        monthlyStats: [],
        reports: []
      };
    } else if (err.response?.status === 400) {
      const errorMsg = err.response?.data?.message || '잘못된 요청입니다.';
      error.value = `${errorMsg}\n\n조직 정보가 올바르게 설정되지 않았을 수 있습니다.`;
    } else if (err.response?.status === 401) {
      error.value = '로그인이 필요합니다.';
    } else {
      error.value = err.response?.data?.message || '대시보드 데이터를 불러오는데 실패했습니다.';
    }
  } finally {
    loading.value = false;
  }
};

const downloadExcel = async () => {
  try {
    const response = await http.get('/dashboard/org/excel', {
      responseType: 'blob'
    });
    
    // 파일 다운로드 처리
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const today = new Date().toISOString().split('T')[0];
    link.download = `조직_대시보드_원자료_${today}.xlsx`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('엑셀 다운로드 실패:', error);
    alert('엑셀 파일 다운로드에 실패했습니다.');
  }
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
.corps-wrapper {
  background-color: #f4f6fb;
  min-height: 100vh;
  padding: 24px 20px;
}

.stats-row {
  display: flex;
  gap: 25px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: flex-start;
}

@media (max-width: 1024px) {
  .stats-row {
    flex-direction: column;
    align-items: flex-start;
  }
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

.excel-download-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  margin-left: auto;
  margin-top: 0;
  height: fit-content;
}

.excel-download-btn:hover:not(:disabled) {
  background-color: #059669;
  transform: translateY(-1px);
}

.excel-download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.excel-icon {
  font-size: 16px;
}
</style>