<template>
  <div class="activity-list-page">
    <!-- 상단 배너 이미지 영역 -->
    <section class="hero">
      <div class="hero-image">
        <div class="hero-overlay">
          <h1 class="hero-title">활동 후기</h1>
        </div>
      </div>
    </section>

    <!-- 후기 리스트 영역 -->
    <section class="content">
      <div class="list-card">
        <!-- 테이블 헤더 -->
        <div class="list-header">
          <span class="col-no">번호</span>
          <span class="col-org">단체명</span>
          <span class="col-title">활동명</span>
          <span class="col-date">작성일</span>
        </div>

        <!-- 후기 목록 -->
        <ul class="list-body">
          <li
            v-for="item in paginatedActivities"
            :key="item.id"
            class="list-row"
          >
            <span class="col-no">{{ item.no }}</span>
            <span class="col-org">{{ item.orgName }}</span>

            <!-- 나중에 상세페이지 생기면 router-link로 교체 가능 -->
            <span class="col-title">
              <router-link
                :to="{ path: '/review-detail', query: { id: item.id } }"
                class="title-link"
              >
                {{ item.title }}
              </router-link>
            </span>

            <span class="col-date">{{ item.date }}</span>
          </li>

          <!-- 데이터가 없을 때 -->
          <li v-if="paginatedActivities.length === 0" class="empty-row">
            등록된 활동 후기가 없습니다.
          </li>
        </ul>

        <!-- 페이지네이션 -->
        <div class="pagination" v-if="totalPages > 1">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="goPage(currentPage - 1)"
          >
            ‹
          </button>

          <button
            v-for="page in totalPages"
            :key="page"
            class="page-btn"
            :class="{ active: page === currentPage }"
            @click="goPage(page)"
          >
            {{ page }}
          </button>

          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="goPage(currentPage + 1)"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "ActivityList",
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 8,
      // TODO: 백엔드 연동 전에 사용하는 더미 데이터
      activities: [
        {
          id: 10,
          no: 10,
          orgName: "디디오지구",
          title: "해안 쓰레기 줍기 활동",
          date: "2024.05.30",
        },
        {
          id: 9,
          no: 9,
          orgName: "뭉그레",
          title: "신입 활동가 양성 프로젝트",
          date: "2024.05.28",
        },
        {
          id: 8,
          no: 8,
          orgName: "쓰엇숨소",
          title: "연안 쓰레기 수거 활동",
          date: "2024.05.24",
        },
        {
          id: 7,
          no: 7,
          orgName: "쓴숨인",
          title: "해안 쓰레기 줍기 활동",
          date: "2024.05.20",
        },
        {
          id: 6,
          no: 6,
          orgName: "여름디",
          title: "신입 활동가 양성 프로젝트",
          date: "2024.05.18",
        },
        {
          id: 5,
          no: 5,
          orgName: "오션케어",
          title: "연안 쓰레기 수거 활동",
          date: "2024.05.10",
        },
        {
          id: 4,
          no: 4,
          orgName: "지구구역수터",
          title: "해안 쓰레기 줍기 활동",
          date: "2024.05.07",
        },
        {
          id: 3,
          no: 3,
          orgName: "당부스터",
          title: "신입 활동가 양성 프로젝트",
          date: "2024.05.03",
        },
        {
          id: 2,
          no: 2,
          orgName: "클린업코리아",
          title: "연안 쓰레기 수거 활동",
          date: "2024.05.01",
        },
      ],
    };
  },
  computed: {
    totalPages() {
      return Math.max(1, Math.ceil(this.activities.length / this.itemsPerPage));
    },
    paginatedActivities() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.activities.slice(start, end);
    },
  },
  methods: {
    goPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>

<style scoped>
.activity-list-page {
  min-height: 100vh;
  background-color: #f3f4f6;
}

/* 상단 파도 이미지 영역 (임시 gradient, 실제에선 배경이미지 넣어도 됨) */
.hero-image {
  width: 100%;
  height: 220px;
  background-image: linear-gradient(
    to bottom,
    #0f172a 0%,
    #1e3a8a 45%,
    #38bdf8 100%
  );
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 32px;
  background: linear-gradient(
    to top,
    rgba(15, 23, 42, 0.5),
    rgba(15, 23, 42, 0)
  );
}

.hero-title {
  color: #ffffff;
  font-size: 28px;
  font-weight: 700;
}

/* 본문 카드 */
.content {
  display: flex;
  justify-content: center;
  padding: 32px 16px 48px;
}

.list-card {
  width: 100%;
  max-width: 800px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
  padding: 24px 32px 28px;
}

/* 테이블 스타일 */
.list-header,
.list-row {
  display: grid;
  grid-template-columns: 70px 140px 1fr 120px;
  align-items: center;
}

.list-header {
  padding: 8px 0 10px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
}

.list-body {
  list-style: none;
  margin: 0;
  padding: 0;
}

.list-row {
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
}

.list-row:last-child {
  border-bottom: none;
}

.col-no {
  text-align: center;
  color: #6b7280;
}

.col-org {
  font-weight: 500;
  color: #111827;
}

.col-title {
  padding: 0 8px;
}

.title-link {
  text-decoration: none;
  color: #111827;
}

.title-link:hover {
  text-decoration: underline;
}

.col-date {
  text-align: right;
  font-size: 13px;
  color: #6b7280;
}

.empty-row {
  padding: 40px 0;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
}

.page-btn {
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 13px;
  cursor: pointer;
}

.page-btn:hover:not(:disabled) {
  background: #f3f4f6;
}

.page-btn.active {
  background: #111827;
  color: #ffffff;
  border-color: #111827;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

/* 반응형 */
@media (max-width: 640px) {
  .list-card {
    padding: 16px 16px 20px;
  }

  .list-header,
  .list-row {
    grid-template-columns: 50px 110px 1fr 90px;
  }

  .hero-image {
    height: 180px;
  }

  .hero-title {
    font-size: 22px;
  }
}
</style>
