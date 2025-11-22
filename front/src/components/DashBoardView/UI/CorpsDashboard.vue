<template>
  <div class="corps-wrapper">
    <!-- 환경단체 대시보드입니다. -->

    <!-- 이곳에 필요한 대시보드 네모 컴포넌트들을 나열한다.
        예시로 생성한 ResultCard의 경우, 다음과 같이 title에 제목, 
        delta에 변화량, result에 최종 수치를 넣도록 하였다. -->

    <!-- ## 대시보드 컴포넌트 참고, 파일명 통일 부탁드립니다
        1. ResultCard: 수치 나타내는 네모칸
        2. GraphCard(아직 제작 안됨): 그래프가 들어가는 네모칸
        3. ListCard(아직 제작 안됨): 리스트가 있는 네모칸
        4. PictureCard(아직 제작 안됨): 프로필, 저장된 후기 사진 네모칸 -->

    <ResultCard
      title="누적 작성된 후기"
      :delta="getDelta()"
      :result="getResult()"
    />

    <ListCard
      title="작성된 후기"
      :columns="[
        { label: '제목', key: 'title' },
        { label: '날짜', key: 'date' },
        { label: '참여 인원', key: 'people' },
        { label: '총 수거량', key: 'amount' },
      ]"
      :contents="reviews"
    />

    <!-- 추후 api 연결 시 사용 -->
    <!-- 로딩 중 -->
    <!-- <div v-if="loading">로딩 중...</div> -->

    <!-- 에러 발생 -->
    <!-- <div v-else-if="error">리뷰 목록을 불러오지 못했습니다.</div> -->

    <!-- 데이터 표시 -->
    <!-- <ListCard
      v-else
      title="작성된 후기"
      :columns="[
        { label: '제목', key: 'title' },
        { label: '날짜', key: 'date' },
        { label: '참여 인원', key: 'people' },
        { label: '총 수거량', key: 'amount' },
      ]"
      :contents="reviews"
    /> -->
  </div>
</template>

<script>
import ResultCard from "@/components/DashBoardView/Components/ResultCard.vue";
import ListCard from "@/components/DashBoardView/Components/ListCard.vue";

export default {
  components: { ResultCard, ListCard },

  methods: {
    // 이 부분은 임의로 작성되었으며, 추후 변경 필요함.
    getDelta() {
      return 5;
    },
    getResult() {
      return 420;
    },
  },

  data() {
    return {
      reviews: [
        {
          title: "수거 5차",
          date: "2025.10.10",
          people: 10,
          amount: 500,
        },
        {
          title: "수거 4차",
          date: "2025.10.01",
          people: 10,
          amount: 500,
        },
        {
          title: "수거 3차",
          date: "2025.9.30",
          people: 10,
          amount: 500,
        },
        {
          title: "수거 2차",
          date: "2025.9.16",
          people: 10,
          amount: 500,
        },
        {
          title: "수거 1차",
          date: "2025.9.1",
          people: 10,
          amount: 500,
        },
      ],
    };
  },

  // 추후 api 연결용 코드
  // data() {
  //   return {
  //     reviews: [],
  //     loading: true,
  //     error: null,
  //   };
  // },

  // async created() {
  //   try {
  //     // 🔥 실제 API URL로 변경하면 됨
  //     const response = await fetch("/api/corps/reviews");

  //     if (!response.ok) {
  //       throw new Error("리뷰 API 응답 오류");
  //     }

  //     const data = await response.json();

  //     this.reviews = data; // 리스트 반영
  //   } catch (err) {
  //     console.error("리뷰 API 에러:", err);
  //     this.error = err;
  //   } finally {
  //     this.loading = false;
  //   }
  // },
};
</script>

<style scoped>
.corps-wrapper {
  background-color: #f4f6fb; /* 원하는 배경색 */
  min-height: 100vh; /* 화면 전체 채우기 */
  padding: 24px 20px; /* 상하 여백 */
}
</style>
