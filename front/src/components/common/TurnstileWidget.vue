<template>
  <div class="turnstile-container">
    <div class="turnstile-widget" :id="widgetId"></div>
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineEmits, defineExpose } from 'vue'

const emit = defineEmits(['token', 'error'])

const props = defineProps({
  siteKey: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    default: 'light'
  },
  size: {
    type: String,
    default: 'normal'
  }
})

const widgetId = ref(`turnstile-${Math.random().toString(36).substr(2, 9)}`)
const widget = ref(null)
const error = ref('')
const token = ref('')

let isLoaded = false

// Turnstile 스크립트 로드
const loadTurnstileScript = () => {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.defer = true
    
    script.onload = () => {
      // 스크립트 로드 후 turnstile 객체가 준비될 때까지 대기
      const checkTurnstile = () => {
        if (window.turnstile) {
          resolve()
        } else {
          setTimeout(checkTurnstile, 100)
        }
      }
      checkTurnstile()
    }
    
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// 위젯 렌더링
const renderWidget = () => {
  if (!window.turnstile || isLoaded) return

  try {
    widget.value = window.turnstile.render(widgetId.value, {
      sitekey: props.siteKey,
      theme: props.theme,
      size: props.size,
      callback: (responseToken) => {
        token.value = responseToken
        error.value = ''
        emit('token', responseToken)
      },
      'error-callback': (errorCode) => {
        const errorMessage = getErrorMessage(errorCode)
        error.value = errorMessage
        emit('error', errorMessage)
      },
      'expired-callback': () => {
        token.value = ''
        error.value = '인증이 만료되었습니다. 다시 시도해주세요.'
        emit('error', '인증이 만료되었습니다. 다시 시도해주세요.')
      }
    })
    isLoaded = true
  } catch (err) {
    console.error('Turnstile 위젯 렌더링 실패:', err)
    error.value = '보안 인증 위젯을 불러올 수 없습니다.'
    emit('error', '보안 인증 위젯을 불러올 수 없습니다.')
  }
}

// 에러 메시지 변환
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'network-error': '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.',
    'parse-error': '응답을 처리하는 중 오류가 발생했습니다.',
    'bad-request': '잘못된 요청입니다. 페이지를 새로고침해주세요.',
    'invalid-input-secret': '사이트 설정 오류입니다. 관리자에게 문의해주세요.',
    'missing-input-secret': '사이트 설정 오류입니다. 관리자에게 문의해주세요.',
    'invalid-input-response': '인증 응답이 유효하지 않습니다. 다시 시도해주세요.',
    'missing-input-response': '인증을 완료해주세요.',
    'timeout-or-duplicate': '인증 시간이 초과되었거나 중복 요청입니다. 다시 시도해주세요.'
  }
  
  return errorMessages[errorCode] || `인증 오류가 발생했습니다. (${errorCode})`
}

// 위젯 리셋
const reset = () => {
  if (widget.value && window.turnstile) {
    try {
      window.turnstile.reset(widget.value)
      token.value = ''
      error.value = ''
    } catch (err) {
      console.error('Turnstile 위젯 리셋 실패:', err)
    }
  }
}

// 토큰 반환
const getToken = () => {
  return token.value
}

// 인증 완료 여부 확인
const isValid = () => {
  return !!token.value && !error.value
}

// 외부에서 사용할 수 있는 메서드 노출
defineExpose({
  reset,
  getToken,
  isValid
})

onMounted(async () => {
  try {
    await loadTurnstileScript()
    renderWidget()
  } catch (err) {
    console.error('Turnstile 초기화 실패:', err)
    error.value = '보안 인증 시스템을 불러올 수 없습니다.'
    emit('error', '보안 인증 시스템을 불러올 수 없습니다.')
  }
})

onBeforeUnmount(() => {
  if (widget.value && window.turnstile) {
    try {
      window.turnstile.remove(widget.value)
    } catch (err) {
      console.error('Turnstile 위젯 제거 실패:', err)
    }
  }
})
</script>

<style scoped>
.turnstile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 16px 0;
}

.turnstile-widget {
  min-height: 65px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.error-message {
  color: #dc2626;
  font-size: 14px;
  text-align: center;
  padding: 8px 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  max-width: 400px;
}

/* 로딩 상태 표시 */
.turnstile-widget:empty::after {
  content: "보안 인증을 불러오는 중...";
  color: #6b7280;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 65px;
}
</style>