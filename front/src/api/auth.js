// 인증 관련 API 및 토큰 관리
import http from './http'

// JWT 토큰 관리
export const tokenManager = {
  // 토큰 저장
  setToken(token) {
    localStorage.setItem('accessToken', token)
    // axios 기본 헤더에 토큰 설정
    http.defaults.headers.common['Authorization'] = `Bearer ${token}`
  },

  // 토큰 조회
  getToken() {
    return localStorage.getItem('accessToken')
  },

  // 토큰 제거 
  removeToken() {
    localStorage.removeItem('accessToken')
    delete http.defaults.headers.common['Authorization']
  },

  // 토큰 유효성 간단 체크 (만료시간 확인)
  isTokenValid() {
    const token = this.getToken()
    if (!token) return false

    try {
      // JWT 페이로드 디코딩 (base64)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      
      return payload.exp > currentTime
    } catch (error) {
      console.error('토큰 파싱 오류:', error)
      return false
    }
  },

  // 사용자 정보 추출
  getUserInfo() {
    const token = this.getToken()
    if (!token) return null

    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return {
        uid: payload.uid,
        email: payload.sub,
        role: payload.role
      }
    } catch (error) {
      console.error('사용자 정보 추출 오류:', error)
      return null
    }
  }
}

// 앱 시작시 토큰 복원
const savedToken = tokenManager.getToken()
if (savedToken && tokenManager.isTokenValid()) {
  http.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
}

// 인증 API
export const authAPI = {
  // 로그인
  async login(email, password) {
    try {
      const response = await http.post('/auth/login', {
        email,
        password
      })

      const { accessToken } = response.data
      
      // 토큰 저장
      tokenManager.setToken(accessToken)
      
      return {
        success: true,
        data: response.data,
        user: tokenManager.getUserInfo()
      }
    } catch (error) {
      console.error('로그인 실패:', error)
      
      // 에러 메시지 추출
      let message = '로그인에 실패했습니다.'
      if (error.response?.status === 401) {
        message = '이메일 또는 비밀번호가 올바르지 않습니다.'
      } else if (error.response?.status === 400) {
        message = '입력 정보를 확인해주세요.'
      } else if (error.response?.data?.message) {
        message = error.response.data.message
      }

      return {
        success: false,
        message
      }
    }
  },

  // 회원가입
  async signup(userData) {
    try {
      const response = await http.post('/auth/signup', {
        userName: userData.name,
        userEmail: userData.email,
        userPw: userData.password,
        userPhone: userData.phone
      })

      return {
        success: true,
        data: response.data,
        message: '회원가입이 완료되었습니다!'
      }
    } catch (error) {
      console.error('회원가입 실패:', error)
      
      // 에러 메시지 추출
      let message = '회원가입에 실패했습니다.'
      if (error.response?.status === 409) {
        message = '이미 가입된 이메일입니다.'
      } else if (error.response?.status === 400) {
        message = '입력 정보를 확인해주세요.'
      } else if (error.response?.data?.message) {
        message = error.response.data.message
      }

      return {
        success: false,
        message
      }
    }
  },

  // 로그아웃
  logout() {
    tokenManager.removeToken()
    return {
      success: true,
      message: '로그아웃되었습니다.'
    }
  },

  // 현재 로그인 상태 확인
  isLoggedIn() {
    return tokenManager.isTokenValid()
  },

  // 현재 사용자 정보
  getCurrentUser() {
    return tokenManager.getUserInfo()
  }
}

// HTTP 인터셉터 설정 (토큰 만료시 자동 로그아웃)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 또는 무효
      tokenManager.removeToken()
      
      // 로그인 페이지로 리다이렉트 (필요시)
      if (window.location.pathname !== '/login') {
        alert('로그인이 필요합니다.')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default authAPI