<!-- src/components/MapView/MapSidePanel.vue -->
<template>
  <aside class="map-side-panel is-open">

    <div class="panel-inner">
      <!-- 헤더 -->
      <header class="panel-header">
        <div class="panel-title-wrap">
          <p class="panel-badge">
            {{ pinTypeText }}
          </p>
          <h2 class="panel-location">
            {{ pinDetail?.locationName || pinDetailTitle }}
          </h2>
          <p class="panel-coords" v-if="pinDetail">
            위도: {{ (pinDetail.pinY ?? pinDetail.lat)?.toFixed(3) }},
            경도: {{ (pinDetail.pinX ?? pinDetail.lng)?.toFixed(3) }}
          </p>
        </div>

    
      </header>

      <div class="panel-scroll">
        <!-- 활동 정보 -->
        <section class="section">
          <h3 class="section-title">활동 정보</h3>

          <ul class="stats-list">
  <!-- 최근 활동 -->
<li class="stats-item">
  <span class="stats-icon">
    <!-- 심플한 1인 아이콘 -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#444"
      stroke-width="1.7"
    >
      <!-- 머리 -->
      <circle cx="12" cy="8" r="3.2" />
      <!-- 어깨/몸 -->
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M7 18a5 5 0 0 1 10 0"
      />
    </svg>
  </span>
  <div class="stats-text">
    <span class="stats-label">최근 활동:</span>
    <span class="stats-value">
      {{ pinDetail?.recentActivityText || '-' }}
    </span>
  </div>
</li>


  <!-- 누적 수거량 -->
  <li class="stats-item">
    <span class="stats-icon">
      <!-- Archive Box Arrow Down Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.6" stroke="#444" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M3 7.5V6a2 2 0 012-2h14a2 2 0 012 2v1.5M3 7.5h18m-18 0v9a2 2 
             0 002 2h14a2 2 0 002-2v-9m-6 4.5l-3 3m0 0l-3-3m3 3V9" />
      </svg>
    </span>
    <div class="stats-text">
      <span class="stats-label">누적 수거량:</span>
      <span class="stats-value">
        {{ pinDetail?.totalWeightText || '-' }}
      </span>
    </div>
  </li>

  <!-- 누적 활동 횟수 -->
  <li class="stats-item">
    <span class="stats-icon">
      <!-- Calendar Icon -->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke-width="1.6" stroke="#444" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 
             00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </span>
    <div class="stats-text">
      <span class="stats-label">누적 활동 횟수:</span>
      <span class="stats-value">
        {{ pinDetail?.totalCountText || '-' }}
      </span>
    </div>
  </li>
</ul>


        </section>

        <!-- 활동 후기 -->
        <section class="section">
          <h3 class="section-title">활동 후기</h3>

          <p v-if="!activityLogs || !activityLogs.length" class="empty-text">
            아직 등록된 활동 후기가 없어요.
          </p>

          <ul v-else class="review-list">
            <li
              v-for="log in activityLogs"
              :key="log.id"
              class="review-card"
            >
              <div class="review-info">
                <h4 class="review-title">{{ log.title }}</h4>
                <p class="review-meta">
                  {{ log.date }} · {{ log.orgName }}
                </p>
                <p class="review-desc">
                  {{ log.description }}
                </p>
              </div>
              <div v-if="log.thumbnailUrl" class="review-thumb-wrap">
                <img
                  class="review-thumb"
                  :src="log.thumbnailUrl"
                  :alt="log.title"
                />
              </div>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  pinDetail: {
    type: Object,
    default: null,
  },
  activityLogs: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['close', 'register-activity'])

const pinTypeText = computed(() => {
  const color = props.pinDetail?.pinColor?.toLowerCase()
  if (color === 'red') return '정화필요지역'
  if (color === 'blue') return '활동완료지역'
  if (color === 'white') return '신규지역'
  return '정화필요지역'
})

const pinDetailTitle = computed(() => {
  if (!props.pinDetail) return '지역 정보 없음'
  // notifyContent 앞부분을 제목처럼 사용 (임시)
  if (props.pinDetail.notifyContent) {
    return String(props.pinDetail.notifyContent).slice(0, 12) + '...'
  }
  return '지역 정보'
})
</script>

<style scoped>
.map-side-panel {
  position: fixed; /* MapView의 .map-container 가 position:relative 여야 함 */
  top:93px;
  right: 0;
  height: calc(100vh - 80px);
  width: 420px;                 /* 오른쪽 패널 폭 넉넉하게 */
  max-width: 100%;
  background: #F0F1F6;         /* 전체 연한 회색톤 배경 */
  border-left: 1px solid #F0F1F6; /* 아주 연한 파란 보더 */
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.06);
  transform: translateX(100%);
  transition: transform 0.3s ease-out;
  z-index: 30;
  display: flex;
}



/* isOpen=true 일 때 오른쪽에서 슬라이드 인 */
.map-side-panel.is-open {
  transform: translateX(0);
}

.panel-inner {
  display: flex;
  flex-direction: column;
  width: 100%;
}

/* ── 헤더 영역 ───────────────────────────── */

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 22px 12px;
  background: #F0F1F6;       /* 상단도 같은 배경색 */
}

.panel-title-wrap {
  flex: 1;
  min-width: 0;
}

/* "정화필요지역" – 빨간 큰 글씨 */
.panel-badge {
  font-size: 18px;
  font-weight: 800;
  color: #FF4D4D;
  margin: 0 0 6px;
}

/* 두 번째 줄 – 흐린 회색 작은 글씨 (예: 울산 연안 (위도 …)) */
.panel-location {
  font-size: 13px;
  font-weight: 500;
  color: #666;
  margin: 0;
}

/* 좌표는 살짝 더 연하게 */
.panel-coords {
  margin-top: 4px;
  font-size: 12px;
  color: #9a9aa0;
}

.panel-close-btn {
  border: none;
  background: transparent;
  font-size: 26px;  /* 크게 */
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 8px;
  color: #111;      /* 진하게 */
}

/* ── 본문 스크롤 영역 ───────────────────── */

.panel-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 12px 22px 24px;
}

/* 섹션 타이틀 (활동 정보 / 활동 후기) */
.section + .section {
  margin-top: 24px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
}

/* ── 활동 정보 라인들 ───────────────────── */

.stats-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}

/* 카드가 아니라, 스크린샷처럼 "텍스트 라인" 느낌으로 */
.stats-item {
  display: flex;
  align-items: center;
  padding: 4px 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.stats-item + .stats-item {
  margin-top: 4px;
}

.stats-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
}


.stats-text {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 13px;
}

.stats-label {
  color: #555;
  margin-right: 4px;
}

.stats-value {
  color: #333;
  font-weight: 600;
}

/* ── 활동 등록하기 버튼 ─────────────────── */

.register-btn {
  display: block;
  width: 80%;                 /* 가운데 꽉 찬 느낌 */
  max-width: 260px;
  margin: 14px auto 0;        /* 가운데 정렬 */
  border-radius: 999px;
  border: none;
  padding: 11px 0;
  background: #F7A5A5;        /* 핑크 버튼 */
  color: #ffffff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  
}

/* ── 활동 후기 리스트 ───────────────────── */

.empty-text {
  font-size: 12px;
  color: #888;
}

.review-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 카드 형태 – 스크린샷과 비슷하게 */
.review-card {
  display: flex;
  align-items: stretch;
  background: #ffffff;
  border-radius: 16px;
  padding: 12px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.review-card + .review-card {
  margin-top: 12px;
}

.review-info {
  flex: 1;
  min-width: 0;
  padding-right: 10px;
}

.review-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #333;
}

.review-meta {
  font-size: 11px;
  color: #888;
  margin-bottom: 6px;
}

.review-desc {
  font-size: 12px;
  color: #555;
  line-height: 1.45;
}

/* 오른쪽 썸네일 */
.review-thumb-wrap {
  width: 88px;
  height: 88px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
}

.review-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 모바일에서 전체 폭 차지 */
@media (max-width: 768px) {
  .map-side-panel {
    position: fixed;
    top: 80px;                 /* 상단 헤더 높이에 맞춰 조정 */
    right: 0;
    width: 100%;
    height: calc(100vh - 80px);
  }
}
</style>
