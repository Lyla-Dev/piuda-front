<template>
  <div class="manager-wrapper">
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

    <!-- 권한 없음 -->
    <div v-else-if="!hasManagerAccess" class="access-denied">
      <p>🚫 관리자 권한이 필요합니다</p>
      <p>바살넷 관리자만 접근할 수 있는 페이지입니다.</p>
    </div>

    <!-- 관리자 대시보드 -->
    <template v-else>
      <!-- 상단 통계 카드 -->
      <div class="stats-row">
        <ResultCard
          title="등록된 회원 수"
          :delta="0"
          :result="statsData.accumUser"
          unit="명"
        />
        <ResultCard
          title="누적 시민 제보"
          :delta="0"
          :result="statsData.accumNotify"
          unit="회"
        />
        <ResultCard
          title="누적 폐기물 kg"
          :delta="0"
          :result="statsData.accumKg"
          unit="kg"
        />
        <ResultCard
          title="누적 폐기물 L"
          :delta="0"
          :result="statsData.accumL"
          unit="L"
        />
        <ResultCard
          title="누적 활동 횟수"
          :delta="0"
          :result="statsData.accumAct"
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
        :monthlyStats="dashboardData.monthlyStats || []"
        :trashData="dashboardData"
      />

      <ListCard
        title="시민 제보 현황"
        :columns="[
          { label: '제보 ID', key: 'reportId', width: '10%' },
          { label: '제보일', key: 'reportDate', width: '15%' },
          { label: '제보 내용', key: 'content', width: '20%' },
          { label: '제보 사진', key: 'photo', width: '12%' },
          { label: '처리', key: 'action', width: '25%' },
        ]"
        :contents="formattedNotifies"
        :actions="[
          { label: '사진 보기', action: handleViewPhoto, key: 'photo' },
          { label: '승인', action: handleApprove, key: 'approve', style: 'primary' },
          { label: '거절', action: handleReject, key: 'reject', style: 'danger' }
        ]"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ListCard from '@/components/DashBoardView/Components/ListCard.vue';
import ResultCard from '@/components/DashBoardView/Components/ResultCard.vue';
import GraphCard from '@/components/DashBoardView/Components/GraphCard.vue';
import http from '@/api/http';
import { authAPI } from '@/api/auth';

const router = useRouter();
const loading = ref(true);
const error = ref(null);
const hasManagerAccess = ref(false);
const dashboardData = ref({});

// 관리자 권한 확인
const checkManagerAccess = async () => {
  try {
    const user = await authAPI.getCurrentUser();
    
    // ADMIN 또는 MANAGER 역할 확인
    if (user && (user.role === 'ADMIN' || user.role === 'MANAGER')) {
      hasManagerAccess.value = true;
      return true;
    } else {
      hasManagerAccess.value = false;
      return false;
    }
  } catch (err) {
    hasManagerAccess.value = false;
    return false;
  }
};

// 관리자 통계 데이터
const statsData = computed(() => ({
  accumUser: dashboardData.value.accumUser || 0,
  accumNotify: dashboardData.value.accumNotify || 0,
  accumKg: dashboardData.value.accumKg || 0,
  accumL: dashboardData.value.accumL || 0,
  accumAct: dashboardData.value.accumAct || 0
}));

// 시민 제보 현황을 ListCard에 맞는 형태로 변환 (WAIT 상태만 필터링)
const formattedNotifies = computed(() => {
  const notifies = dashboardData.value.notifies || [];
  
  // WAIT 상태인 제보만 필터링
  return notifies
    .filter(notify => (notify.notifyStatus || notify.status) === 'WAIT')
    .map(notify => {
      const dateStr = notify.notifyCreatedAt || notify.createdAt;
      let formattedDate = new Date().toISOString().split('T')[0];
      
      if (dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
      }
      
      return {
        reportId: notify.notifyId || notify.id,
        reportDate: formattedDate,
        content: notify.notifyContent || notify.content || ' - ',
        photoUrl: (notify.photoUrls && notify.photoUrls.length > 0) ? notify.photoUrls[0] : null,
        photoUrls: notify.photoUrls || [],
        status: notify.notifyStatus || notify.status
      };
    });
});

const fetchDashboardData = async () => {
  try {
    loading.value = true;
    error.value = null;

    // 관리자 권한 확인
    const hasAccess = await checkManagerAccess();
    if (!hasAccess) {
      error.value = '관리자 권한이 필요합니다.';
      return;
    }

    // 관리자 대시보드 데이터 가져오기
    const response = await http.get('/dashboard/admin');
    dashboardData.value = response.data;

  } catch (err) {
    if (err.response?.status === 403) {
      error.value = '관리자 권한이 없습니다.';
      hasManagerAccess.value = false;
    } else if (err.response?.status === 401) {
      error.value = '로그인이 필요합니다.';
      router.push('/login');
    } else {
      error.value = err.response?.data?.message || '데이터를 불러오는데 실패했습니다.';
      
      // 에러 시 빈 데이터로 초기화
      dashboardData.value = {};
    }
  } finally {
    loading.value = false;
  }
};

// 제보 사진 보기
const handleViewPhoto = (row) => {
  console.log('📸 제보 사진 열기 시도:', {
    reportId: row.reportId,
    photoUrls: row.photoUrls,
    firstUrl: row.photoUrls?.[0]
  });
  
  if (!row.photoUrls || row.photoUrls.length === 0) {
    console.warn('⚠️ 제보 사진 없음:', row);
    alert('제보 사진이 없습니다.');
    return;
  }
  
  const photoUrl = row.photoUrls[0];
  console.log('✅ 사진 URL로 새 탭 열기:', photoUrl);
  
  try {
    window.open(photoUrl, '_blank');
  } catch (error) {
    console.error('❌ 사진 열기 실패:', error);
    alert('사진을 열 수 없습니다.');
  }
};

// 제보 승인 (ACCEPT로 전송)
const handleApprove = async (row) => {
  try {
    await http.post(`/notify/${row.reportId}/accept`);
    
    alert('제보가 승인되었습니다.');
    // 데이터 새로고침
    await fetchDashboardData();
  } catch (error) {
    alert(`승인 처리에 실패했습니다: ${error.response?.data || error.message}`);
  }
};

// 제보 거절 (REJECT로 전송)
const handleReject = async (row) => {
  if (!confirm('정말 이 제보를 거절하시겠습니까?')) {
    return;
  }
  
  try {
    await http.post(`/notify/${row.reportId}/reject`);
    
    alert('제보가 거절되었습니다.');
    // 데이터 새로고침
    await fetchDashboardData();
  } catch (error) {
    alert(`거절 처리에 실패했습니다: ${error.response?.data || error.message}`);
  }
};

// 엑셀 다운로드
const downloadExcel = async () => {
  try {
    const response = await http.get('/dashboard/admin/excel', {
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
    link.download = `관리자_대시보드_원자료_${today}.xlsx`;
    
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
.manager-wrapper {
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

@media (max-width: 1024px) {
  .stats-row {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .excel-download-btn {
    width: 100%;
    justify-content: center;
  }
}

.loading-state,
.error-state,
.access-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.access-denied {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  padding: 40px;
  margin: 40px auto;
  max-width: 500px;
}

.access-denied p:first-child {
  font-size: 24px;
  font-weight: 700;
  color: #dc2626;
  margin-bottom: 8px;
}

.access-denied p:last-child {
  font-size: 16px;
  color: #7f1d1d;
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
