<template>
  <div class="review-page">
    <!-- Hero Section -->
    <section class="review-hero">
      <div class="overlay">
        <h1 class="hero-title">활동 후기</h1>
      </div>
    </section>

    <!-- Content Wrapper -->
    <main class="review-wrapper">
      <div class="review-list">
        <div
          class="review-row"
          v-for="(review, index) in paginatedReviews"
          :key="index"
          @click="goToDetail(review)"
        >
          <span class="col-number">
            {{ totalReviews - (itemsPerPage * (currentPage - 1)) - index }}
          </span>

          <span class="col-team">{{ review.team }}</span>
          <span class="col-activity">{{ review.activity }}</span>

          <span class="col-info">
            {{ review.info }}
          </span>
        </div>
      </div>

      <!-- 페이지네이션 (원래 로직 살려서) -->
      <div v-if="pageCount > 1" class="pagination">
        <button
          v-for="page in pageCount"
          :key="page"
          class="page-btn"
          :class="{ active: page === currentPage }"
          @click="setPage(page)"
        >
          {{ page }}
        </button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'ReviewList',
  data() {
    return {
      reviews: [
        { team: "디프다제주", activity: "해안 쓰레기 줍기 활동", info: "인천 해안 | 2025.10" },
        { team: "봉그젠", activity: "신진 활동가 양성 프로젝트", info: "제주 해안 | 2025.09" },
        { team: "쓰담속초", activity: "심해 쓰레기 수거 활동", info: "속초 해안 | 2025.08" },
        { team: "쓰줍인", activity: "해안 쓰레기 줍기 활동", info: "인천 해안 | 2025.10" },
        { team: "에코팀", activity: "신진 활동가 양성 프로젝트", info: "제주 해안 | 2025.03" },
        { team: "오션케어", activity: "심해 쓰레기 수거 활동", info: "인천 해안 | 2025.09" },
        { team: "지구별막수터", activity: "해안 쓰레기 줍기 활동", info: "제주 해안 | 2025.04" },
        { team: "팀부스터", activity: "신진 활동가 양성 프로젝트", info: "인천 해안 | 2025.05" },
        { team: "플로로그코리아", activity: "심해 쓰레기 수거 활동", info: "제주 해안 | 2025.09" },
        { team: "바다사랑", activity: "해안 정화 캠페인", info: "부산 해안 | 2025.10" },
        { team: "푸른지구", activity: "신진 활동가 양성 프로젝트", info: "인천 해안 | 2025.11" },
        { team: "클린오션", activity: "심해 쓰레기 수거 활동", info: "속초 해안 | 2025.11" }
      ],
      itemsPerPage: 10,
      currentPage: 1
    };
  },
  computed: {
    totalReviews() {
      return this.reviews.length;
    },
    pageCount() {
      return Math.ceil(this.totalReviews / this.itemsPerPage);
    },
    paginatedReviews() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.reviews.slice().reverse().slice(start, end);
    }
  },
  methods: {
    setPage(page) {
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    goToDetail(review) {
      // TODO: 여기 너 원래 쓰던 라우터 로직 넣으면 됨
      // 예: this.$router.push({ name: 'ReviewDetail', params: { id: review.id } });
      console.log('goToDetail:', review);
    }
  }
};
</script>

<style scoped>
.review-page {
  width: 100%;
  background: #f9fafb;
}

/* Hero */
.review-hero {
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #F0F1F6 0%, #bdc8ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-hero .overlay {
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-title {
  color: #333;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
}


/* Wrapper */
.review-wrapper {
  max-width: 900px;
  margin: 50px auto;
  padding: 0 20px 40px;
}

/* List */
.review-list {
  background: white;
  border-radius: 14px;
  padding: 20px 30px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.05);
}

/* Row */
.review-row {
  display: grid;
  grid-template-columns: 60px 160px 1fr 190px;
  padding: 18px 0;
  border-bottom: 1px solid #e9ecef;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
}

.review-row:last-child {
  border-bottom: none;
}

.review-row:hover {
  background: #f8f9fc;
  transform: translateY(-1px);
}

/* Columns */
.col-number {
  font-size: 14px;
  color: #adb5bd;
}

.col-team {
  font-weight: 600;
  color: #222;
}

.col-activity {
  color: #444;
  font-size: 15px;
}

.col-info {
  text-align: right;
  font-size: 14px;
  color: #666;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.page-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid #dee2e6;
  background: white;
  font-size: 13px;
  cursor: pointer;
  transition: 0.15s ease;
}

.page-btn:hover {
  background: #f1f3f5;
}

.page-btn.active {
  background: #228be6;
  color: white;
  border-color: #228be6;
}

/* 모바일 */
@media (max-width: 768px) {
  .review-row {
    grid-template-columns: 50px 120px 1fr;
    row-gap: 6px;
  }

  .col-info {
    grid-column: span 3;
    text-align: left;
    margin-top: 4px;
  }

  .review-wrapper {
    margin-top: 30px;
  }

  .review-list {
    padding: 16px 18px;
  }
}
</style>
