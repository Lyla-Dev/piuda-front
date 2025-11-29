<template>
  <div class="graph-card-wrapper">
    <!-- 월별 폐기물 수거량 및 참여자 수 -->
    <div class="graph-card">
      <h3 class="card-title">월별 폐기물 수거량 및 참여자 수</h3>
      <div class="chart-container">
        <canvas ref="barChart"></canvas>
      </div>
    </div>

    <!-- 폐기물 분류별 비율 -->
    <div class="graph-card">
      <h3 class="card-title">폐기물 분류별 비율</h3>
      <div class="chart-container">
        <canvas ref="doughnutChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  monthlyStats: {
    type: Array,
    default: () => []
  },
  trashData: {
    type: Object,
    default: () => ({})
  }
})

const barChart = ref(null)
const doughnutChart = ref(null)
let barChartInstance = null
let doughnutChartInstance = null

// 막대 그래프 생성
const createBarChart = () => {
  if (!barChart.value || !props.monthlyStats.length) return

  const ctx = barChart.value.getContext('2d')
  
  // 기존 차트 파괴
  if (barChartInstance) {
    barChartInstance.destroy()
  }

  const labels = props.monthlyStats.map(stat => `${stat.month}월`)
  const kgData = props.monthlyStats.map(stat => stat.kg)
  const reportCountData = props.monthlyStats.map(stat => stat.reportCount)

  barChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '수거량 (kg)',
          data: kgData,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          label: '활동 횟수',
          data: reportCountData,
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1,
          borderRadius: 4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 13
          },
          bodyFont: {
            size: 12
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          beginAtZero: true,
          title: {
            display: true,
            text: '수거량 (kg)',
            font: {
              size: 12
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: 11
            }
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          beginAtZero: true,
          title: {
            display: true,
            text: '참여자 수 (명)',
            font: {
              size: 12
            }
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            stepSize: 4,
            font: {
              size: 11
            }
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            }
          }
        }
      }
    }
  })
}

// 도넛 차트 생성
const createDoughnutChart = () => {
  if (!doughnutChart.value || !props.trashData) return

  const ctx = doughnutChart.value.getContext('2d')
  
  // 기존 차트 파괴
  if (doughnutChartInstance) {
    doughnutChartInstance.destroy()
  }

  // 쓰레기 종류별 데이터
  const trashCategories = [
    { label: '페트병', value: props.trashData.accumTrashPet || 0, color: '#3b82f6' },
    { label: '비닐봉지', value: props.trashData.accumTrashBag || 0, color: '#8b5cf6' },
    { label: '어망/어구', value: props.trashData.accumTrashNet || 0, color: '#ec4899' },
    { label: '유리병', value: props.trashData.accumTrashGlass || 0, color: '#f59e0b' },
    { label: '캔류', value: props.trashData.accumTrashCan || 0, color: '#10b981' },
    { label: '로프끈', value: props.trashData.accumTrashRope || 0, color: '#6366f1' },
    { label: '의류', value: props.trashData.accumTrashCloth || 0, color: '#14b8a6' },
    { label: '전자제품', value: props.trashData.accumTrashElec || 0, color: '#f43f5e' },
    { label: '기타', value: props.trashData.accumTrashEtc || 0, color: '#64748b' }
  ]

  // 0이 아닌 값만 필터링
  const filteredData = trashCategories.filter(item => item.value > 0)
  
  if (filteredData.length === 0) {
    // 데이터가 없을 경우 기본 메시지
    return
  }

  doughnutChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: filteredData.map(item => item.label),
      datasets: [{
        data: filteredData.map(item => item.value),
        backgroundColor: filteredData.map(item => item.color),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 12,
            font: {
              size: 11
            },
            generateLabels: (chart) => {
              const data = chart.data
              if (data.labels.length && data.datasets.length) {
                return data.labels.map((label, i) => {
                  const value = data.datasets[0].data[i]
                  const total = data.datasets[0].data.reduce((a, b) => a + b, 0)
                  const percentage = ((value / total) * 100).toFixed(1)
                  
                  return {
                    text: `${label} ${percentage}%`,
                    fillStyle: data.datasets[0].backgroundColor[i],
                    hidden: false,
                    index: i
                  }
                })
              }
              return []
            }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 13
          },
          bodyFont: {
            size: 12
          },
          callbacks: {
            label: (context) => {
              const label = context.label || ''
              const value = context.parsed || 0
              const total = context.dataset.data.reduce((a, b) => a + b, 0)
              const percentage = ((value / total) * 100).toFixed(1)
              return `${label}: ${value}개 (${percentage}%)`
            }
          }
        }
      }
    }
  })
}

onMounted(() => {
  createBarChart()
  createDoughnutChart()
})

// props 변경 감지
watch(() => [props.monthlyStats, props.trashData], () => {
  createBarChart()
  createDoughnutChart()
}, { deep: true })
</script>

<style scoped>
.graph-card-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.graph-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

@media (max-width: 1024px) {
  .graph-card-wrapper {
    grid-template-columns: 1fr;
  }
  
  .chart-container {
    height: 280px;
  }
}
</style>
