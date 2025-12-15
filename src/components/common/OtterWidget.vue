<template>
  <button class="otter-fab" @click="go" aria-label="오늘의 수달">
    <img class="otter-img" :src="otterImg" alt="otter" />
    <div class="bubble">🌊✨이번 분기<br />바다 히어로 확인</div>
  </button>
</template>

<script setup>
import { useRouter } from "vue-router";
import otterImg from "@/assets/otter.png";

const router = useRouter();
const go = () => router.push("/award");
</script>

<style scoped>
/* 버튼 자체는 투명 */
.otter-fab{
  position: fixed;
  right: 50px;
  bottom: 50px;          /* 필요하면 조절 */
  z-index: 9999;

  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;

  /* 모바일 탭 하이라이트 제거 */
  -webkit-tap-highlight-color: transparent;
}

/* 수달 자체 */
.otter-img{
  width: 100px;           /* 두번째 이미지 느낌 */
  height: auto;
  object-fit: contain;

  animation: otter-float 2.2s ease-in-out infinite;
  filter: none;
}

/* 둥둥 + 살짝 흔들 */
@keyframes otter-float{
  0%   { transform: translateY(0) rotate(0deg); }
  25%  { transform: translateY(-6px) rotate(-2deg); }
  50%  { transform: translateY(0) rotate(0deg); }
  75%  { transform: translateY(-4px) rotate(2deg); }
  100% { transform: translateY(0) rotate(0deg); }
}

/* 눌렀을 때 살짝 줄어드는 피드백 */
.otter-fab:active .otter-img{
  transform: scale(0.95);
}

.bubble{
  position: absolute;
  top: -70px;
  left: 50%;
  transform: translateX(-50%);

  background: white;
  padding: 6px 10px;
  border-radius: 12px;

  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  border: 2px solid #333;
}

/* 꼬리 테두리 */
.bubble::before{
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);

  border-width: 10px 8px 0 8px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

/* 꼬리 안쪽 */
.bubble::after{
  content: "";
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);

  border-width: 8px 6px 0 6px;
  border-style: solid;
  border-color: white transparent transparent transparent;
}


</style>
