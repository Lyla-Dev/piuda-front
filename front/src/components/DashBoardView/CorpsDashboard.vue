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
    </div>
  </template>
  
  <script>
  import ResultCard from './ResultCard.vue'
  
  export default {
    components: { ResultCard },
  
    methods: {
      getDelta() {
        return 5
      },
      getResult() {
        return 420
      }
    // 이 부분은 임의로 작성되었으며, 추후 변경 필요함.
    }
  }
  </script>
  
  <style scoped>
  .corps-wrapper {
    background-color: #f4f6fb; /* 원하는 배경색 */
    min-height: 100vh;         /* 화면 전체 채우기 */
    padding: 30px 20px;           /* 상하 여백 */
  }
  </style>
  