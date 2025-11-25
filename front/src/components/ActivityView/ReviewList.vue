<template>
    <div>
        

        <section class="hero-section"></section>

        <main class="review-container">
            <h1 class="main-title">활동 후기</h1>

            <div class="review-list-wrapper">
                <div
                    class="review-item"
                    v-for="(review, index) in paginatedReviews"
                    :key="review.id"
                    @click="goToDetail(review)"
                >
                    <span class="review-number">
                        {{ totalReviews - (itemsPerPage * (currentPage - 1)) - index }}
                    </span>
                    <span class="review-team">{{ review.team }}</span>
                    <span class="review-activity">{{ review.activity }}</span>
                    <span class="review-info">{{ review.info }}</span>
                </div>

            </div>

            <div class="pagination-container" v-if="pageCount > 1">
                <button 
                    v-for="page in pageCount" 
                    :key="page"
                    :class="{ active: page === currentPage }"
                    @click="setPage(page)"
                >
                    {{ page }}
                </button>
                <span class="next-pages">>></span>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    name: 'ReviewList', // 파일 이름에 맞게 ReviewList로 설정
    data() {
        return {
            reviews: [
                { id: 1, team: "디프다제주", activity: "해안 쓰레기 줍기 활동", info: "인천 해안 | 2025.10" },
                { id: 2, team: "봉그젠", activity: "신진 활동가 양성 프로젝트", info: "제주 해안 | 2025.09" },
                { id: 3, team: "쓰담속초", activity: "심해 쓰레기 수거 활동", info: "속초 해안 | 2025.08" },
                { id: 4, team: "쓰줍인", activity: "해안 쓰레기 줍기 활동", info: "인천 해안 | 2025.10" },
                { id: 5, team: "에코팀", activity: "신진 활동가 양성 프로젝트", info: "제주 해안 | 2025.03" },
                { id: 6, team: "오션케어", activity: "심해 쓰레기 수거 활동", info: "인천 해안 | 2025.09" },
                { id: 7, team: "지구별막수터", activity: "해안 쓰레기 줍기 활동", info: "제주 해안 | 2025.04" },
                { id: 8, team: "팀부스터", activity: "신진 활동가 양성 프로젝트", info: "인천 해안 | 2025.05" },
                { id: 9, team: "플로로그코리아", activity: "심해 쓰레기 수거 활동", info: "제주 해안 | 2025.09" },
                { id: 10, team: "바다사랑", activity: "해안 정화 캠페인", info: "부산 해안 | 2025.10" },
                { id: 11, team: "푸른지구", activity: "신진 활동가 양성 프로젝트", info: "인천 해안 | 2025.11" },
                { id: 12, team: "클린오션", activity: "심해 쓰레기 수거 활동", info: "속초 해안 | 2025.11" }
                ],

            itemsPerPage: 10, // 페이지당 항목 수
            currentPage: 1
        };
    },
    computed: {
        totalReviews() {
            return this.reviews.length;
        },
        pageCount() {
            // 총 항목 수를 페이지당 항목 수로 나누어 페이지 수를 계산합니다.
            return Math.ceil(this.totalReviews / this.itemsPerPage);
        },
        paginatedReviews() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            
            // 후기 목록을 최신순(역순)으로 표시하기 위해 배열을 복사 후 역순으로 정렬하고 페이지네이션을 적용
            return this.reviews.slice().reverse().slice(start, end);
        }
    },
    methods: {
        setPage(page) {
            this.currentPage = page;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        goToDetail(review) {
            this.$router.push({
            name: 'ReviewDetail',
            params: { id: review.id }
            });
        }
    }

};
</script>

<style scoped>
/* * <style scoped> 블록 내에는 스타일시트 코드가 포함되어야 합니다.
 * 이전 CSS 코드를 그대로 붙여넣습니다.
 */

/* 기본 리셋 및 폰트 설정 */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    color: #333;
}

a {
    text-decoration: none;
    color: inherit;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

/* 🚩 상단바 스타일 */
.main-header {
    background-color: #fff;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
}

.logo {
    font-size: 18px;
    font-weight: bold;
    color: #004d99; /* 바다 느낌의 색상 */
    display: flex;
    flex-direction: column;
    line-height: 1.2;
}

.logo-sub {
    font-size: 8px;
    font-weight: normal;
    color: #999;
    margin-top: 2px;
}

.main-nav ul {
    display: flex;
    gap: 30px;
}

.main-nav a {
    font-size: 14px;
    color: #333;
    padding: 5px 0;
    transition: color 0.3s;
}

.main-nav a:hover {
    color: #007bff;
}

.login-btn a {
    padding: 8px 15px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: #555;
}

/* 🚩 배경 이미지 섹션 */
.hero-section {
    background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); /* 실제 이미지를 여기에 넣어주세요 */
    background-size: cover;
    background-position: center;
    height: 250px; /* 높이 조정 */
    margin-bottom: 40px;
}

/* 🚩 후기 목록 컨테이너 및 제목 */
.review-container {
    max-width: 800px; /* 목록 폭을 이미지처럼 좁게 설정 */
    margin: 0 auto;
    padding: 0 20px;
}

.main-title {
    text-align: center;
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 30px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ddd;
    color: #222;
}

/* 🚩 후기 아이템 스타일 */
.review-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
    font-size: 15px;
    cursor: pointer;
}

.review-item:last-child {
    border-bottom: none;
}

.review-number {
    width: 30px;
    text-align: right;
    color: #888;
    font-weight: bold;
}

.review-team {
    flex: 1;
    padding-left: 20px;
    font-weight: bold;
}

.review-activity {
    flex: 2;
    color: #555;
}

.review-info {
    width: 150px;
    text-align: right;
    color: #999;
    font-size: 13px;
}

/* 🚩 페이지네이션 스타일 */
.pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    margin-bottom: 60px;
}

.pagination-container button,
.pagination-container span {
    background: none;
    border: none;
    padding: 8px 15px;
    margin: 0 3px;
    cursor: pointer;
    font-size: 14px;
    color: #555;
    border-radius: 4px;
    transition: background-color 0.3s, color 0.3s;
}

.pagination-container button:hover:not(.active) {
    background-color: #e0e0e0;
}

.pagination-container .active {
    background-color: #007bff;
    color: white;
    font-weight: bold;
    pointer-events: none; /* 클릭 비활성화 */
}

/* '>>' 버튼 스타일 */
.pagination-container .next-pages {
    font-weight: bold;
}
</style>