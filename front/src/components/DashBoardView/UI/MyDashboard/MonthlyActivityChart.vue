<template>
  <div class="chart-card">
    <h2 class="chart-title">월별 활동 횟수</h2>
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const props = defineProps({
  monthlyData: {
    type: Array,
    default: () => []
  }
});

const chartCanvas = ref(null);
let chartInstance = null;

const createChart = () => {
  if (!chartCanvas.value) return;

  // 기존 차트 제거
  if (chartInstance) {
    chartInstance.destroy();
  }

  // 연도별로 데이터 분리
  const data2024 = props.monthlyData.filter(item => item.year === 2024);
  const data2025 = props.monthlyData.filter(item => item.year === 2025);

  // 1월~12월 라벨 생성
  const labels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  // 각 연도별 데이터 배열 생성 (1-12월)
  const counts2024 = Array(12).fill(0);
  const counts2025 = Array(12).fill(0);

  data2024.forEach(item => {
    counts2024[item.month - 1] = item.reportCount || 0;
  });

  data2025.forEach(item => {
    counts2025[item.month - 1] = item.reportCount || 0;
  });

  const ctx = chartCanvas.value.getContext('2d');
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '2024년',
          data: counts2024,
          borderColor: 'rgba(99, 102, 241, 1)',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgba(99, 102, 241, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          fill: true
        },
        {
          label: '2025년',
          data: counts2025,
          borderColor: 'rgba(16, 185, 129, 1)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgba(16, 185, 129, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 13
            },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 13
          },
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: ${context.parsed.y}회`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          ticks: {
            font: {
              size: 12
            }
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
};

onMounted(() => {
  createChart();
});

watch(() => props.monthlyData, () => {
  createChart();
}, { deep: true });
</script>

<style scoped>
.chart-card {
  background: #fff;
  padding: 24px;
  border-radius: 30px;
  width: 100%;
}

.chart-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #1f2937;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
