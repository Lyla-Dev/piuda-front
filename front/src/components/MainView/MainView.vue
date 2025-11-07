<template>
  <section class="hero">
    <img src="@/assets/main_pic.png" alt="main" class="hero-bg" />
    <div class="overlay">
      <div class="text-group">
        <p class="hero-sub">우리 바다를 살리는 전국 해양보호단체 협의체</p>
        <h1 class="hero-title">바다살리기네트워크</h1>
      </div>
    </div>
  </section>

<!-- Mission Section -->
<section class="mission">
  <div class="mission-container">
    <!-- 왼쪽 텍스트 -->
    <div class="mission-text">
      <h2>바다를 살리는 한 걸음</h2>
      <p>
        바다살리기네트워크는 해양 생태계와<br />
        생물 다양성 보호를 위해 노력하고 있습니다.<br />
        작은 행동이 일으키는 변화의 물결에<br />
        함께 해보아요
      </p>
    </div>

    <!-- 오른쪽 버튼 2x2 -->
    <div class="mission-buttons">
      <button @click="$router.push('/report')">
        해양쓰레기<br />제보하기
      </button>

      <button @click="$router.push('/activity-list')">
        활동<br />참가하기
      </button>

      <button @click="$router.push('/map')">
        해양지도<br />바로가기
      </button>

      <button @click="$router.push('/activity-form')">
        활동 후기<br />작성하기
      </button>
        </div>
      </div>
    </section>


    <!-- Activity Section -->
    <section class="activity">
      <div class="header">
        <h2>활동 후기 살펴보기</h2>
        <a href="#" class="see-all">전체 보기</a>
      </div>

      <div class="activity-list">
        <div class="activity-item">
          <h3><span class="team">디프다 제주</span> 해안 쓰레기 줍기 활동</h3>
          <p>참여 인원: 20명, 수거량: 20kg</p>
          <p class="date">인천 해변 | 2025.10</p>
        </div>
        <div class="activity-item">
          <h3><span class="team">봉그젠</span> 신진 활동가 양성 프로젝트</h3>
          <p>참여 인원: 20명, 수거량: 20kg</p>
          <p class="date">제주 해변 | 2025.09</p>
        </div>
        <div class="activity-item">
          <h3><span class="team">쓰담 속초</span> 심해 쓰레기 수거 활동</h3>
          <p>참여 인원: 20명, 수거량: 20kg</p>
          <p class="date">속초 해변 | 2025.08</p>
        </div>
      </div>
    </section>

    <section class="partners">
      <h2>바다살리기네트워크 소속 단체</h2>

      <div class="carousel">
        <!-- 왼쪽 화살표 -->
        <button class="nav prev" @click="prevSlide">‹</button>

        <div class="carousel-window">
          <div class="carousel-track" :style="trackStyle">
            <div
              class="partner-item"
              v-for="(partner, index) in partners"
              :key="index"
            >
              <img :src="partner.img" :alt="partner.name" />
              <p>{{ partner.name }}</p>
            </div>
          </div>
        </div>

        <!-- 오른쪽 화살표 -->
        <button class="nav next" @click="nextSlide">›</button>
      </div>
    </section>

    <!-- Footer -->
    <footer>
      <p>사단법인 바다살리기네트워크</p>
      <p>이사장 정재익 | 사무국장 최윤</p>
      <p>교육번호 444-82-00657 | 주소 서울시 구로구 디지털로32가길 16</p>
      <p>문의: badanetwork@projectlusaion.com</p>
      <p class="copyright">
        Copyright ⓒ 2025 바다살리기네트워크 All rights reserved.
      </p>
    </footer>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const partners = [
  { img: require("@/assets/teambooster.png"), name: "팀부스터 | 동해" },
  { img: require("@/assets/bgzjeju.png"), name: "봉그젠 | 제주" },
  { img: require("@/assets/dipda.png"), name: "디프다제주 | 제주" },
  { img: require("@/assets/jejubarid.png"), name: "제주바당 | 제주" },
  { img: require("@/assets/ssodam.png"), name: "쓰담속초 | 동해" },
];

const currentIndex = ref(0);
// const visibleCount = 3; // 한 화면에 보이는 카드 개수
const slideWidth = 240; // 각 카드의 가로 폭(px)

const trackStyle = computed(() => ({
  transform: `translateX(-${currentIndex.value * slideWidth}px)`,
  transition: "transform 0.6s ease",
}));

function nextSlide() {
  currentIndex.value =
    (currentIndex.value + 1) % partners.length;
}

function prevSlide() {
  currentIndex.value =
    (currentIndex.value - 1 + partners.length) % partners.length;
}

/* 자동 슬라이드 */
let autoSlideInterval;
onMounted(() => {
  autoSlideInterval = setInterval(nextSlide, 3000);
});
onBeforeUnmount(() => {
  clearInterval(autoSlideInterval);
});
</script>


<style scoped>
.main-page {
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  color: #222;
}

/* Hero Section */
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}

.text-group {
  position: absolute;
  bottom: 8%;
  right: 6%;
  color: white;
  text-align: right;
}

.hero-sub {
  font-size: 1rem;
  opacity: 0.9;
}
.hero-title {
  font-size: 2.4rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.mission {
  background-color: #f6f8ff;
  border-radius: 40px 40px 0 0;
  padding: 4rem 2rem;
  display: flex;
  justify-content: center;
}

/* 내부 컨테이너: 텍스트 + 버튼 나란히 */
.mission-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1000px;
  flex-wrap: wrap;
  margin: 0 auto; /* ✅ 중앙 정렬 */
}

/* 왼쪽 텍스트 영역 */
.mission-text {
  flex: 1;
  min-width: 260px;
}
.mission-text h2 {
  font-size: 1.8rem;
  color: #16236a;
  margin-bottom: 1rem;
}
.mission-text p {
  color: #555;
  line-height: 1.7;
}

/* 오른쪽 버튼 영역 */
.mission-buttons {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* ✅ 2열 */
  gap: 1rem;
  justify-items: center;
  min-width: 320px;
}

/* 버튼 스타일 */
.mission-buttons button {
  background: #f8faff;
  border: 2px solid #1a2b6d;
  color: #1a2b6d;
  padding: 1rem;
  width: 180px;
  height: 110px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.mission-buttons button:hover {
  background: #e3e9ff;
}

/* 아이콘 */
.mission-buttons img {
  width: 32px;
  height: 32px;
  margin-bottom: 0.5rem;
}

/* Activity Section */
.activity {
  padding: 4rem 1.5rem;
  background: white;
}
.activity .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
.activity h2 {
  color: #16236a;
  font-size: 1.6rem;
  font-weight: bold;
}
.see-all {
  color: #777;
  text-decoration: none;
}
.activity-list {
  border-top: 1px solid #ddd;
}
.activity-item {
  border-bottom: 1px solid #ddd;
  padding: 1rem 0;
}
.activity-item h3 {
  font-size: 1.1rem;
  margin: 0.5rem 0;
}
.activity-item .team {
  color: #2e3fa3;
  font-weight: bold;
}
.activity-item .date {
  font-size: 0.9rem;
  color: #777;
}

.partners {
  padding: 4rem 1.5rem;
  background-color: #f8faff;
  text-align: left;
  overflow: hidden; /* 추가: 화살표가 나가도 가로 스크롤 안 생기게 */
}

.partners h2 {
  color: #16236a;
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.carousel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1150px;
  margin: 0 auto;
}

/* 표시창 */
.carousel-window {
  width: 100%;
  overflow: hidden;
}

/* 트랙 */
.carousel-track {
  display: flex;
  gap: 1.5rem;
}

/* 개별 카드 */
.partner-item {
  flex: 0 0 220px;
  text-align: center;
  background: white;
  border-radius: 16px;
  padding: 0.5rem;
}
.partner-item img {
  width: 90%;
  border-radius: 12px;
}
.partner-item p {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

/* 화살표 버튼 */
.nav {
  background: transparent;
  border: none;
  font-size: 3rem;
  cursor: pointer;
  color: #000000;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.3s;
  z-index: 2;
}

.prev {
  position: absolute;
  left: -70px;
  top: 50%;
  transform: translateY(-50%);
}
.next {
  position: absolute;
  right: -70px;
  top: 50%;
  transform: translateY(-50%);
}

.nav:hover {
  background: #e3e9ff;
}

/* Footer */
footer {
  background: #1a1c4a;
  color: white;
  text-align: center;
  padding: 2rem 1rem;
  font-size: 0.9rem;
}
footer p {
  margin: 0.3rem 0;
}
footer .copyright {
  margin-top: 1rem;
  font-size: 0.8rem;
  opacity: 0.8;
}
</style>
