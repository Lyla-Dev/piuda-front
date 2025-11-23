<!-- src/views/AuthSignUpView.vue -->
<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">회원가입</h1>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <!-- 이름 -->
        <div class="form-group">
          <label for="name">이름</label>
          <input
            id="name"
            v-model.trim="form.name"
            type="text"
            placeholder="이름을 입력해주세요"
          />
          <p v-if="errors.name" class="input-error">{{ errors.name }}</p>
        </div>

        <!-- 성별 -->
        <div class="form-group">
          <label>성별</label>
          <div class="radio-group">
            <label>
              <input
                type="radio"
                value="male"
                v-model="form.gender"
              />
              남성
            </label>
            <label>
              <input
                type="radio"
                value="female"
                v-model="form.gender"
              />
              여성
            </label>
          </div>
          <p v-if="errors.gender" class="input-error">
            {{ errors.gender }}
          </p>
        </div>

        <!-- 나이 -->
        <div class="form-group">
          <label for="age">나이</label>
          <input
            id="age"
            v-model.trim="form.age"
            type="number"
            min="1"
            placeholder="나이를 입력해주세요"
          />
          <p v-if="errors.age" class="input-error">{{ errors.age }}</p>
        </div>

        <!-- 이메일 -->
        <div class="form-group">
          <label for="email">
            이메일
            <span class="label-sub">(아이디로 사용될 예정입니다)</span>
          </label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            placeholder="example@domain.com"
          />
          <p v-if="errors.email" class="input-error">{{ errors.email }}</p>
        </div>

        <!-- 비밀번호 -->
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="8자 이상 입력해주세요"
          />
          <p v-if="errors.password" class="input-error">{{ errors.password }}</p>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="form-group">
          <label for="passwordConfirm">비밀번호 확인</label>
          <input
            id="passwordConfirm"
            v-model="form.passwordConfirm"
            type="password"
            placeholder="비밀번호를 한 번 더 입력해주세요"
          />
          <p v-if="errors.passwordConfirm" class="input-error">
            {{ errors.passwordConfirm }}
          </p>
        </div>

        <!-- 연락처 (선택) -->
        <div class="form-group">
          <label for="phone">연락처 (선택)</label>
          <input
            id="phone"
            v-model.trim="form.phone"
            type="tel"
            placeholder="010-1234-5678"
          />
        </div>

        <!-- 약관 동의 -->
        <div class="form-group checkbox-group">
          <label>
            <input type="checkbox" v-model="form.agreeTerms" />
            <span>
              <strong>서비스 이용약관</strong> 및
              <strong>개인정보 처리방침</strong>에 동의합니다.
            </span>
          </label>
          <p v-if="errors.agreeTerms" class="input-error">
            {{ errors.agreeTerms }}
          </p>
        </div>

        <!-- 전송 에러 -->
        <p v-if="submitError" class="submit-error">
          {{ submitError }}
        </p>

        <!-- 버튼 -->
        <button
          class="submit-btn"
          type="submit"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '회원가입 중...' : '회원가입 완료하기' }}
        </button>

        <!-- 이미 계정 있음 -->
        <p class="helper-text">
          이미 계정이 있으신가요?
          <router-link to="/login">로그인하기</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
// import axios from 'axios' // 실제 API 연결 시 사용

const form = reactive({
  name: '',
  gender: '',
  age: '',
  email: '',
  password: '',
  passwordConfirm: '',
  phone: '',
  agreeTerms: false,
})

const errors = reactive({
  name: '',
  gender: '',
  age: '',
  email: '',
  password: '',
  passwordConfirm: '',
  agreeTerms: '',
})

const isSubmitting = ref(false)
const submitError = ref('')

const validate = () => {
  let valid = true

  // 에러 초기화
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })

  if (!form.name) {
    errors.name = '이름을 입력해주세요.'
    valid = false
  }

  if (!form.gender) {
    errors.gender = '성별을 선택해주세요.'
    valid = false
  }

  if (!form.age) {
    errors.age = '나이를 입력해주세요.'
    valid = false
  } else if (!/^\d+$/.test(form.age) || Number(form.age) <= 0) {
    errors.age = '올바른 나이를 입력해주세요.'
    valid = false
  }

  if (!form.email) {
    errors.email = '이메일을 입력해주세요.'
    valid = false
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = '올바른 이메일 형식을 입력해주세요.'
    valid = false
  }

  if (!form.password) {
    errors.password = '비밀번호를 입력해주세요.'
    valid = false
  } else if (form.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 합니다.'
    valid = false
  }

  if (!form.passwordConfirm) {
    errors.passwordConfirm = '비밀번호 확인을 입력해주세요.'
    valid = false
  } else if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다.'
    valid = false
  }

  if (!form.agreeTerms) {
    errors.agreeTerms = '약관에 동의해야 회원가입이 가능합니다.'
    valid = false
  }

  return valid
}

const handleSubmit = async () => {
  submitError.value = ''

  if (!validate()) return

  isSubmitting.value = true
  try {
    // 실제 API 요청 예시
    /*
    await axios.post('/api/auth/register', {
      name: form.name,
      gender: form.gender,
      age: Number(form.age),
      email: form.email,
      password: form.password,
      phone: form.phone || null,
    })
    */

    alert('회원가입이 완료되었습니다! 🎉 (지금은 더미 동작입니다)')
  } catch (err) {
    submitError.value = '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f7fb;
  padding: 32px;
}

.auth-card {
  width: 100%;
  max-width: 560px; /* 🔹 조금 더 넓게 */
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  padding: 36px 36px 32px;
}

.auth-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 18px;
  text-align: left;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px; /* 🔹 필드 간 간격 조금 더 넓게 */
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.label-sub {
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  margin-left: 4px;
}

.form-group input[type='text'],
.form-group input[type='email'],
.form-group input[type='password'],
.form-group input[type='tel'],
.form-group input[type='number'] {
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 12px 14px; 
  font-size: 14px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.form-group input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.15);
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 20px;
  font-size: 14px;
}

.radio-group label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.checkbox-group label {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.4;
}

.checkbox-group input[type='checkbox'] {
  margin-top: 2px;
}

.input-error {
  color: #dc2626;
  font-size: 12px;
}

.submit-error {
  color: #b91c1c;
  font-size: 13px;
  margin-top: 4px;
}

.submit-btn {
  margin-top: 10px;
  width: 100%;
  border-radius: 999px;
  border: none;
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  background: #2563eb;
  color: #ffffff;
  transition: background 0.15s ease, transform 0.05s ease, box-shadow 0.15s ease;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.35);
}

.submit-btn:hover:enabled {
  background: #1d4ed8;
}

.submit-btn:active:enabled {
  transform: translateY(1px);
  box-shadow: 0 3px 10px rgba(37, 99, 235, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: default;
  box-shadow: none;
}

.helper-text {
  margin-top: 12px;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
}

.helper-text a {
  color: #2563eb;
  font-weight: 600;
}
</style>
