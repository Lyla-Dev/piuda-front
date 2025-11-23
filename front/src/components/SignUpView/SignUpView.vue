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

        <!-- ⭐ 성별 -->
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

        <!-- 이메일 -->
        <div class="form-group">
          <label for="email">이메일</label>
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

        <!-- 회원 유형 -->
        <div class="form-group">
          <label>회원 유형</label>
          <div class="radio-group">
            <label>
              <input
                type="radio"
                value="individual"
                v-model="form.userType"
              />
              일반 시민
            </label>
            <label>
              <input type="radio" value="activist" v-model="form.userType" />
              활동가 / 자원봉사자
            </label>
            <label>
              <input type="radio" value="org_admin" v-model="form.userType" />
              단체 관리자
            </label>
          </div>
          <p v-if="errors.userType" class="input-error">
            {{ errors.userType }}
          </p>
        </div>

        <!-- 소속 단체명 (단체 관련 타입일 때만) -->
        <div
          class="form-group"
          v-if="form.userType === 'activist' || form.userType === 'org_admin'"
        >
          <label for="orgName">소속 단체명</label>
          <input
            id="orgName"
            v-model.trim="form.orgName"
            type="text"
            placeholder="예: 바다살리기네트워크 부산지부"
          />
          <p v-if="errors.orgName" class="input-error">{{ errors.orgName }}</p>
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
  email: '',
  password: '',
  passwordConfirm: '',
  userType: '',
  orgName: '',
  phone: '',
  agreeTerms: false,
})

const errors = reactive({
  name: '',
  gender: '',              
  email: '',
  password: '',
  passwordConfirm: '',
  userType: '',
  orgName: '',
  agreeTerms: '',
})

const isSubmitting = ref(false)
const submitError = ref('')

const validate = () => {
  let valid = true

  // 모든 에러 초기화
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })

  if (!form.name) {
    errors.name = '이름을 입력해주세요.'
    valid = false
  }

  // ⭐ 성별 필수 체크
  if (!form.gender) {
    errors.gender = '성별을 선택해주세요.'
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

  if (!form.userType) {
    errors.userType = '회원 유형을 선택해주세요.'
    valid = false
  }

  if (
    (form.userType === 'activist' || form.userType === 'org_admin') &&
    !form.orgName
  ) {
    errors.orgName = '소속 단체명을 입력해주세요.'
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
      gender: form.gender,   // 
      email: form.email,
      password: form.password,
      userType: form.userType,
      orgName: form.orgName || null,
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
  padding: 24px;
}

.auth-card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  padding: 32px 28px 28px;
}

.auth-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.auth-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-group input[type='text'],
.form-group input[type='email'],
.form-group input[type='password'],
.form-group input[type='tel'] {
  border-radius: 10px;
  border: 1px solid #d1d5db;
  padding: 10px 12px;
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
  gap: 10px 16px;
  font-size: 13px;
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
  margin-top: 6px;
  width: 100%;
  border-radius: 999px;
  border: none;
  padding: 11px 14px;
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
  margin-top: 8px;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
}

.helper-text a {
  color: #2563eb;
  font-weight: 600;
}
</style>
