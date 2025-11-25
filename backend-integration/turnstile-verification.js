/**
 * Cloudflare Turnstile 백엔드 검증 유틸리티
 * 
 * 사용법:
 * 1. 환경변수에 TURNSTILE_SECRET_KEY 설정
 * 2. 각 API 엔드포인트에서 verifyTurnstile() 호출
 * 3. 검증 성공시에만 비즈니스 로직 실행
 */

const fetch = require('node-fetch'); // npm install node-fetch

/**
 * Turnstile 토큰을 Cloudflare API로 검증
 * @param {string} token - 프론트엔드에서 받은 Turnstile 토큰
 * @param {string} remoteip - 클라이언트 IP (선택사항)
 * @returns {Promise<boolean>} - 검증 성공 여부
 */
async function verifyTurnstile(token, remoteip = null) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY 환경변수가 설정되지 않았습니다.');
    return false;
  }

  if (!token) {
    console.warn('Turnstile 토큰이 제공되지 않았습니다.');
    return false;
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    
    if (remoteip) {
      formData.append('remoteip', remoteip);
    }

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Turnstile 검증 성공:', {
        'challenge_ts': result['challenge_ts'],
        'hostname': result.hostname
      });
      return true;
    } else {
      console.warn('Turnstile 검증 실패:', {
        'error-codes': result['error-codes'],
        token: token.substring(0, 10) + '...' // 토큰 일부만 로그
      });
      return false;
    }
  } catch (error) {
    console.error('Turnstile 검증 중 오류 발생:', error.message);
    return false;
  }
}

/**
 * Express.js 미들웨어로 사용할 수 있는 Turnstile 검증기
 * @param {Object} options - 옵션 설정
 * @param {string} options.tokenField - 토큰을 찾을 필드명 (기본값: 'turnstileToken')
 * @param {boolean} options.skipOnMissing - 토큰이 없을 때 통과시킬지 여부 (기본값: false)
 */
function turnstileMiddleware(options = {}) {
  const { tokenField = 'turnstileToken', skipOnMissing = false } = options;
  
  return async (req, res, next) => {
    try {
      // 토큰 추출 (body, query, headers에서 순서대로 찾기)
      let token = req.body[tokenField] || req.query[tokenField] || req.headers['x-turnstile-token'];
      
      // multipart/form-data의 경우 JSON 파싱된 부분에서 토큰 추출
      if (!token && req.body.report) {
        try {
          const reportData = typeof req.body.report === 'string' ? 
            JSON.parse(req.body.report) : req.body.report;
          token = reportData[tokenField];
        } catch (e) {
          // JSON 파싱 실패시 무시
        }
      }
      
      if (!token && req.body.payload) {
        try {
          const payloadData = typeof req.body.payload === 'string' ? 
            JSON.parse(req.body.payload) : req.body.payload;
          token = payloadData[tokenField];
        } catch (e) {
          // JSON 파싱 실패시 무시
        }
      }

      if (!token) {
        if (skipOnMissing) {
          return next();
        }
        return res.status(400).json({ 
          error: 'Bot verification failed',
          message: 'Turnstile token is missing' 
        });
      }

      // 클라이언트 IP 추출
      const clientIP = req.ip || 
                      req.connection.remoteAddress || 
                      req.socket.remoteAddress ||
                      (req.connection.socket ? req.connection.socket.remoteAddress : null);

      // Turnstile 검증
      const isValid = await verifyTurnstile(token, clientIP);
      
      if (!isValid) {
        return res.status(400).json({ 
          error: 'Bot verification failed',
          message: 'Invalid Turnstile token' 
        });
      }

      // 검증 성공시 다음 미들웨어로 진행
      next();
    } catch (error) {
      console.error('Turnstile 미들웨어 오류:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Bot verification failed due to server error' 
      });
    }
  };
}

module.exports = {
  verifyTurnstile,
  turnstileMiddleware
};