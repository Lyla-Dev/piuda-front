<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">로그인</h1>
      
      <form @submit.prevent="login">
        <InputField
          v-model="email"
          label="이메일"
          type="email"
          placeholder="이메일을 입력해주세요"
          required
        />
        
        <InputField
          v-model="password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          required
        />

        <button type="submit" class="login-button primary">
          로그인
        </button>
      </form>

      <div class="divider">
        <span class="divider-text">또는</span>
      </div>

      <button @click="kakaoLogin" class="login-button kakao">
        <span class="kakao-icon">K</span> 
        카카오로 3초 로그인
      </button>

      <div class="link-group">
        <router-link to="/register" class="link-item">회원가입</router-link>
        <span class="link-divider">|</span>
        <a href="/find-password" class="link-item">비밀번호 찾기</a>
      </div>
    </div>
  </div>
</template>

<script>
// 경로: pages/LoginView.vue에서 components/common/InputField.vue로 접근
import InputField from '../common/InputField.vue';

export default {
  name: 'LoginView',
  components: {
    InputField,
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      // ❗ 여기에 일반 로그인 API 호출 로직 구현
      console.log('일반 로그인 시도:', this.email);
      alert('일반 로그인 기능 구현 필요');
    },
    kakaoLogin() {
      // ❗ 여기에 카카오 OAuth 연동 로직 구현
      console.log('카카오 로그인 버튼 클릭');
      alert('카카오 로그인 연동 기능 구현 필요');
    }
  }
};
</script>

<style scoped>
/* 스타일은 이메일/비밀번호, 일반/카카오 버튼에 맞게 조정되었습니다. */

/* 전체 컨테이너 및 중앙 정렬 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh; 
  padding: 40px 20px;
}

.login-box {
  width: 100%;
  max-width: 400px; 
  padding: 30px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
  color: #333;
  font-weight: 600;
}

/* 로그인 버튼 기본 스타일 */
.login-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

/* 일반 로그인 버튼 스타일 */
.login-button.primary {
  background-color: #007bff; 
  color: white;
  font-weight: bold;
}

.login-button.primary:hover {
  background-color: #0056b3;
}

/* 구분선 스타일 */
.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
  color: #aaa;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider:not(:empty)::before {
  margin-right: .5em;
}

.divider:not(:empty)::after {
  margin-left: .5em;
}

/* 카카오 로그인 버튼 스타일 */
.login-button.kakao {
  background-color: #fee500; 
  color: #3c1e1e; 
  font-weight: 500;
}

.login-button.kakao:hover {
  background-color: #f7e100;
}

.kakao-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  font-weight: bold;
  /* 실제 아이콘 대신 K 텍스트로 대체 */
}

/* 링크 그룹 */
.link-group {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}

.link-item {
  color: #007bff;
  text-decoration: none;
}

.link-divider {
  margin: 0 10px;
  color: #ccc;
}
</style>