<template>
  <div class="main-page">
    <section class="hero">
      <div class="overlay">
        <h1 class="title">우리 바다를 지키는 작은 실천</h1>
        <p class="subtitle">바다살리기 네트워크와 함께 해양보호를 시작하세요 🌊</p>
      </div>
    </section>

    <section class="content">
      <h2>메인 페이지</h2>
      <p>이 아래에 활동 요약, 버튼 등을 추가할 수 있습니다.</p>
    </section>
  </div>
</template>

<style scoped>
.main-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 상단 배경 이미지 */
.hero {
  width: 100%;
  height: 100vh; /* ✅ 화면 전체 높이 */
  background-image: url('@/assets/main_pic.png');
  background-size: cover;
  background-position: center;
  position: relative;
}

/* 어두운 오버레이 */
.overlay {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.45);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  text-align: center;
}

.title {
  font-size: 2rem;
  font-weight: bold;
}

.subtitle {
  font-size: 1.2rem;
  margin-top: 0.5rem;
}

/* 본문 영역 */
.content {
  padding: 4rem 1rem;
  background-color: white;
  color: #333;
  width: 100%;
  text-align: center;
}
</style>
