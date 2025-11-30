/**
 * 백엔드 API 엔드포인트 Turnstile 통합 예제
 * 
 * 이 파일은 백엔드 개발자가 참고할 수 있는 완전한 예제입니다.
 * Express.js 기반으로 작성되었으며, 다른 프레임워크에서도 동일한 로직을 적용할 수 있습니다.
 */

const express = require('express');
const multer = require('multer');
const { verifyTurnstile, turnstileMiddleware } = require('./turnstile-verification');

const app = express();
const upload = multer({ dest: 'uploads/' });

// 환경변수 설정 필요
// TURNSTILE_SECRET_KEY=your_secret_key_here

// JSON 파싱 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * 방법 1: 미들웨어 사용 (권장)
 * 
 * 장점: 간단하고 재사용 가능
 * 단점: 세밀한 제어 어려움
 */

// 후기 등록 API - 미들웨어 방식
app.post('/report', 
  upload.array('photos'), 
  turnstileMiddleware({ tokenField: 'turnstileToken' }),
  async (req, res) => {
    try {
      // Turnstile 검증은 미들웨어에서 완료됨
      // 여기서는 비즈니스 로직만 처리
      
      const reportData = JSON.parse(req.body.report);
      const photos = req.files;
      
      console.log('후기 데이터:', reportData);
      console.log('업로드된 사진 수:', photos.length);
      
      // 데이터베이스 저장 로직
      // await saveReportToDatabase(reportData, photos);
      
      res.json({ 
        success: true, 
        message: '후기가 성공적으로 등록되었습니다.',
        reportId: Math.random().toString(36).substr(2, 9) // 임시 ID
      });
      
    } catch (error) {
      console.error('후기 등록 오류:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: '후기 등록 중 오류가 발생했습니다.' 
      });
    }
  }
);

// 쓰레기 신고 API - 미들웨어 방식
app.post('/notify', 
  upload.array('photos'), 
  turnstileMiddleware({ tokenField: 'turnstileToken' }),
  async (req, res) => {
    try {
      const payloadData = JSON.parse(req.body.payload);
      const photos = req.files;
      
      console.log('신고 데이터:', payloadData);
      console.log('업로드된 사진 수:', photos.length);
      
      // 데이터베이스 저장 로직
      // await saveNotificationToDatabase(payloadData, photos);
      
      res.json({ 
        success: true, 
        message: '신고가 성공적으로 접수되었습니다.',
        notificationId: Math.random().toString(36).substr(2, 9) // 임시 ID
      });
      
    } catch (error) {
      console.error('신고 접수 오류:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: '신고 접수 중 오류가 발생했습니다.' 
      });
    }
  }
);

/**
 * 방법 2: 수동 검증 (세밀한 제어가 필요한 경우)
 * 
 * 장점: 세밀한 제어 가능, 커스텀 로직 추가 용이
 * 단점: 코드 중복 가능성
 */

// 후기 등록 API - 수동 검증 방식
app.post('/report-manual', upload.array('photos'), async (req, res) => {
  try {
    // 1. 기본 데이터 추출
    const reportData = JSON.parse(req.body.report);
    const photos = req.files;
    
    // 2. Turnstile 토큰 추출
    const turnstileToken = reportData.turnstileToken;
    
    if (!turnstileToken) {
      return res.status(400).json({ 
        error: 'Bot verification failed',
        message: 'Turnstile token is required' 
      });
    }
    
    // 3. 클라이언트 IP 추출 (선택사항)
    const clientIP = req.ip || req.connection.remoteAddress;
    
    // 4. Turnstile 검증
    const isValidBot = await verifyTurnstile(turnstileToken, clientIP);
    
    if (!isValidBot) {
      return res.status(400).json({ 
        error: 'Bot verification failed',
        message: 'Invalid or expired Turnstile token' 
      });
    }
    
    // 5. 추가 보안 검사 (예: Rate Limiting)
    const userIP = clientIP;
    const isRateLimited = await checkRateLimit(userIP); // 사용자 구현 필요
    
    if (isRateLimited) {
      return res.status(429).json({ 
        error: 'Too many requests',
        message: '너무 많은 요청입니다. 잠시 후 다시 시도해주세요.' 
      });
    }
    
    // 6. 비즈니스 로직 실행
    console.log('후기 데이터:', reportData);
    console.log('업로드된 사진 수:', photos.length);
    
    // 데이터베이스 저장
    // const savedReport = await saveReportToDatabase(reportData, photos);
    
    res.json({ 
      success: true, 
      message: '후기가 성공적으로 등록되었습니다.',
      reportId: Math.random().toString(36).substr(2, 9)
    });
    
  } catch (error) {
    console.error('후기 등록 오류:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: '후기 등록 중 오류가 발생했습니다.' 
    });
  }
});

/**
 * 추가 보안 기능 예제
 */

// Rate Limiting 예제 (Redis 또는 메모리 기반)
const rateLimitStore = new Map();

async function checkRateLimit(ip, maxRequests = 5, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, []);
  }
  
  const requests = rateLimitStore.get(ip);
  
  // 윈도우 밖의 요청 제거
  const validRequests = requests.filter(timestamp => timestamp > windowStart);
  
  if (validRequests.length >= maxRequests) {
    return true; // Rate limited
  }
  
  // 현재 요청 추가
  validRequests.push(now);
  rateLimitStore.set(ip, validRequests);
  
  return false;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    turnstile: {
      enabled: !!process.env.TURNSTILE_SECRET_KEY,
      configured: process.env.TURNSTILE_SECRET_KEY ? 'Yes' : 'No'
    }
  });
});

// 에러 핸들링 미들웨어
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: '서버에서 오류가 발생했습니다.' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Turnstile protection: ${process.env.TURNSTILE_SECRET_KEY ? 'ENABLED' : 'DISABLED'}`);
});

module.exports = app;