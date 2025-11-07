<template>
  <div class="main-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="overlay">
        <div class="text-group">
          <p class="hero-sub">우리 바다를 살리는 전국 해양보호단체 협의체</p>
          <h1 class="hero-title">바다살리기네트워크</h1>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission">
      <h2>바다를 살리는 한 걸음</h2>
      <p>
        바다살리기네트워크는 해양 생태계와 생물 다양성 보호를 위해 노력하고 있습니다.<br />
        각운 행동이 일으키는 변화의 물결에 함께 해보아요.
      </p>

      <div class="button-group">
        <button>해양쓰레기 제보하기</button>
        <button>활동 참가하기</button>
        <button>해양지도 바로가기</button>
        <button>활동 후기 작성하기</button>
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

    <!-- Partner Section -->
    <section class="partners">
      <h2>바다살리기네트워크 소속 단체</h2>
      <div class="partner-list">
        <div class="partner-item">
          <img src="@/assets/teambooster.png" alt="Team Booster" />
          <p>팀부스터 | 동해</p>
        </div>
        <div class="partner-item">
          <img src="@/assets/bgzjeju.png" alt="봉그젠 제주" />
          <p>봉그젠 | 제주</p>
        </div>
        <div class="partner-item">
          <img src="@/assets/dipda.png" alt="디프다 제주" />
          <p>디프다제주 | 제주</p>
        </div>
        <div class="partner-item">
          <img src="@/assets/jejubarid.png" alt="제주바당 제주" />
          <p>제주바당 | 제주</p>
        </div>
        <div class="partner-item">
          <img src="@/assets/ssodam.png" alt="쓰담 속초" />
          <p>쓰담속초 | 동해</p>
        </div>
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
  </div>
</template>

<style scoped>
.main-page {
  font-family: "Pretendard", "Noto Sans KR", sans-serif;
  color: #222;
}

/* Hero Section */
.hero {
  width: 100%;
  height: 80vh;
  background: url("@/assets/main_pic.png") center/cover no-repeat;
  position: relative;
}
.overlay {
  background: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
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

/* Mission Section */
.mission {
  text-align: center;
  padding: 4rem 1rem;
  background-color: #f6f8ff;
  border-radius: 40px 40px 0 0;
  margin-top: -3rem;
}
.mission h2 {
  font-size: 1.8rem;
  color: #16236a;
  margin-bottom: 1rem;
}
.mission p {
  color: #555;
  line-height: 1.7;
  margin-bottom: 2rem;
}
.button-group {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}
.button-group button {
  background: white;
  border: 2px solid #8ea2ff;
  color: #1a2b6d;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}
.button-group button:hover {
  background: #e3e9ff;
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

/* Partner Section */
.partners {
  padding: 4rem 1.5rem;
  background-color: #f8faff;
  text-align: center;
}
.partners h2 {
  color: #16236a;
  font-size: 1.5rem;
  margin-bottom: 2rem;
}
.partner-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}
.partner-item {
  width: 120px;
}
.partner-item img {
  width: 100%;
  border-radius: 16px;
  background-color: white;
  padding: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.partner-item p {
  margin-top: 0.5rem;
  font-size: 0.9rem;
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
