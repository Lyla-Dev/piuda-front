<template>
  <div class="detail-page">
    <main class="detail-container" v-if="review">
      <!-- 상단 히어로 영역 (제목 + 사진) -->
      <section class="detail-hero">
        <h1 class="hero-title">{{ review.activity }}</h1>
        <p class="hero-team">{{ review.team }}</p>

        <div class="hero-images">
          <!-- 이미지가 있을 때 -->
          <div v-if="review.images && review.images.length" class="hero-image-grid">
            <img
              v-for="(img, idx) in review.images"
              :key="idx"
              :src="img"
              alt="활동 사진"
              class="hero-image"
            />
          </div>

          <!-- 이미지가 아직 없을 때 -->
          <div v-else class="hero-image-placeholder">
            활동 사진을 등록해 주세요
          </div>
        </div>
      </section>

      <!-- 상세 정보 카드 (표 형태) -->
      <section class="detail-card">
        <div class="info-row">
          <span class="info-label">활동 장소</span>
          <span class="info-value">
            {{ review.info.split('|')[0].trim() }}
          </span>
        </div>

        <div class="divider"></div>

        <div class="info-row">
          <span class="info-label">활동 일시</span>
          <span class="info-value">
            {{ review.info.split('|')[1] && review.info.split('|')[1].trim() }}
          </span>
        </div>

        <div class="divider"></div>

        <div class="info-row">
          <span class="info-label">총 수거량</span>
          <span class="info-value">
            {{ review.amount || '-' }}
          </span>
        </div>

        <div class="divider"></div>
        
        <div class="info-row">
            <span class="info-label">상세 설명</span>
            <span class="info-value info-description">
            {{ review.content }}
            </span>
        </div>
        
      </section>

      <button class="back-btn" @click="goBack">
        ← 목록으로 돌아가기
      </button>
    </main>

    <main class="detail-container" v-else>
      <p>존재하지 않는 후기입니다.</p>
      <button class="back-btn" @click="goBack">
        ← 목록으로 돌아가기
      </button>
    </main>
  </div>
</template>

<script>
export default {
  name: 'ReviewDetail',
  props: ['id'],
  data() {
    return {
      reviews: [
        {
          id: 1,
          team: "디프다제주",
          activity: "해안 쓰레기 줍기 활동",
          info: "인천 해안 | 2025.10",
          content: "인천 해안을 함께 걸으며 플로깅을 진행했습니다. 생각보다 많은 쓰레기를 보며 충격을 받았지만, 팀원들과 함께 정화 활동을 하며 보람을 느꼈습니다.",
          images: []
        },
        {
          id: 2,
          team: "봉그젠",
          activity: "신진 활동가 양성 프로젝트",
          info: "제주 해안 | 2025.09",
          content: "해양 환경 교육과 함께 실제 정화 활동을 병행한 프로젝트였습니다. 교육과 현장이 결합되니 훨씬 더 의미있게 다가왔습니다.",
          images: []
        },
        {
          id: 3,
          team: "쓰담속초",
          activity: "심해 쓰레기 수거 활동",
          info: "속초 해안 | 2025.08.21",
          content: "심해 쓰레기 수거 과정을 직접 보고, 우리가 버린 쓰레기가 결국 다시 우리에게 돌아온다는 사실을 체감하게 되었습니다.",
          amount: "24kg", // 예시 값
          images: [
            "https://images.pexels.com/photos/2774301/pexels-photo-2774301.jpeg",
            "https://images.pexels.com/photos/4558800/pexels-photo-4558800.jpeg"
          ]
        },
        {
          id: 4,
          team: "쓰줍인",
          activity: "해안 쓰레기 줍기 활동",
          info: "인천 해안 | 2025.10",
          content: "가족 단위 참여자가 많아서 아이들과 함께 환경에 대해 이야기 나눌 수 있어 좋았습니다.",
          images: []
        },
        {
          id: 5,
          team: "에코팀",
          activity: "신진 활동가 양성 프로젝트",
          info: "제주 해안 | 2025.03",
          content: "해양 환경과 관련된 다양한 강연이 있었고, 이후 팀 프로젝트까지 진행하면서 팀워크를 다질 수 있었습니다.",
          images: []
        },
        {
          id: 6,
          team: "오션케어",
          activity: "심해 쓰레기 수거 활동",
          info: "인천 해안 | 2025.09",
          content: "전문가 분들과 함께 심해 쓰레기 실태를 듣고, 함께 해결 방안을 고민해보는 시간이었습니다.",
          images: []
        },
        {
          id: 7,
          team: "지구별약수터",
          activity: "해안 쓰레기 줍기 활동",
          info: "제주 해안 | 2025.04",
          content: "제주 바다를 지키기 위한 작은 실천이 모여 큰 변화를 만들 수 있다는 것을 다시 느꼈습니다.",
          images: []
        },
        {
          id: 8,
          team: "팀부스터",
          activity: "신진 활동가 양성 프로젝트",
          info: "인천 해안 | 2025.05",
          content: "프로그램을 통해 많은 활동가 분들을 만나 인사이트를 얻을 수 있었습니다.",
          images: []
        },
        {
          id: 9,
          team: "플로로그코리아",
          activity: "심해 쓰레기 수거 활동",
          info: "제주 해안 | 2025.09",
          content: "바다 색은 아름다웠지만, 해저에 쌓인 쓰레기를 보고 마음이 무거워졌습니다.",
          images: []
        },
        {
          id: 10,
          team: "바다사랑",
          activity: "해안 정화 캠페인",
          info: "부산 해안 | 2025.10",
          content: "캠페인 형식으로 진행되어 시민들의 참여를 자연스럽게 이끌어낼 수 있었습니다.",
          images: []
        },
        {
          id: 11,
          team: "푸른지구",
          activity: "신진 활동가 양성 프로젝트",
          info: "인천 해안 | 2025.11",
          content: "환경 문제 해결을 위해 어떤 관점으로 접근해야 할지 배울 수 있었던 유익한 시간이었습니다.",
          images: []
        },
        {
          id: 12,
          team: "클린오션",
          activity: "심해 쓰레기 수거 활동",
          info: "속초 해안 | 2025.11",
          content: "추운 날씨에도 많은 분들이 참여해주셔서 감동받았습니다.",
          images: []
        }
      ]
    };
  },
  computed: {
    review() {
      const idNum = Number(this.id);
      return this.reviews.find((r) => r.id === idNum) || null;
    }
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'ReviewList' });
    }
  }
};
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background-color: #F4F5FF;
  padding: 40px 20px;
}

.detail-container {
  max-width: 900px;
  margin: 0 auto;
}

/* 상단 히어로 영역 */
.detail-hero {
  text-align: center;
  margin-bottom: 32px;
}

.hero-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #222;
}

.hero-team {
  font-size: 14px;
  color: #777;
  margin-bottom: 24px;
}

/* 이미지 영역 */
.hero-images {
  display: flex;
  justify-content: center;
}

.hero-image-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  width: 100%;
  max-width: 680px;
}

.hero-image {
  width: 100%;
  height: 260px;
  object-fit: cover;
  border-radius: 24px;
}

/* 사진 없을 때 회색 박스 */
.hero-image-placeholder {
  width: 100%;
  max-width: 680px;
  height: 260px;
  border-radius: 24px;
  background: #e9e9e9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

/* 상세 정보 카드 (표 스타일) */
.detail-card {
  background: #fff;
  border-radius: 12px;
  padding: 8px 40px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* 한 줄(라벨 + 값) */
.info-row {
  display: flex;
  align-items: center;
  padding: 14px 0;
  font-size: 14px;
}

/* 상세 설명 라벨 줄 */
.info-row--vertical {
  flex-direction: column;
  align-items: flex-start;
  padding-top: 20px;
}

/* 왼쪽 라벨 */
.info-label {
  flex: 0 0 110px;
  text-align: left;
  color: #777;
}

/* 오른쪽 값 */
.info-value {
  flex: 1;
  text-align: center;
  color: #333;
  font-weight: 400;
}

/* 회색 줄 */
.divider {
  width: 100%;
  height: 1px;
  background-color: #e5e5e5;
}

/* 상세 설명 텍스트 */
.info-description {
  margin-top: 12px;
  font-size: 14px;
  color: #333;
  line-height: 1.7;
  white-space: pre-line;
}

/* 뒤로가기 버튼 */
.back-btn {
  margin-top: 24px;
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  font-size: 14px;
  cursor: pointer;
  background-color: #2D336B;
  color: #fff;
}
</style>
