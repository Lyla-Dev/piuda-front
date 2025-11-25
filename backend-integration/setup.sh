#!/bin/bash

# 🛡️ Cloudflare Turnstile 빠른 설정 스크립트
# 
# 이 스크립트는 백엔드 개발자가 빠르게 Turnstile을 설정할 수 있도록 도와줍니다.

echo "🛡️  Cloudflare Turnstile 백엔드 설정을 시작합니다..."
echo ""

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
    echo "❌ package.json 파일을 찾을 수 없습니다."
    echo "   Node.js 프로젝트 루트 디렉토리에서 실행해주세요."
    exit 1
fi

echo "📦 필요한 패키지를 설치합니다..."
npm install node-fetch

echo ""
echo "📁 Turnstile 검증 파일을 복사합니다..."
# 실제로는 개발자가 수동으로 파일을 복사해야 함
echo "   다음 파일들을 프로젝트에 복사하세요:"
echo "   - turnstile-verification.js"
echo "   - server-example.js (참고용)"

echo ""
echo "⚙️  환경변수 설정을 확인합니다..."

if [ -f ".env" ]; then
    if grep -q "TURNSTILE_SECRET_KEY" .env; then
        echo "   ✅ .env 파일에 TURNSTILE_SECRET_KEY가 이미 있습니다."
    else
        echo "   📝 .env 파일에 TURNSTILE_SECRET_KEY를 추가합니다..."
        echo "" >> .env
        echo "# Cloudflare Turnstile" >> .env
        echo "TURNSTILE_SECRET_KEY=your_secret_key_here" >> .env
        echo "   ✅ TURNSTILE_SECRET_KEY 추가됨 (.env 파일 확인 후 실제 키로 교체하세요)"
    fi
else
    echo "   📝 .env 파일을 생성합니다..."
    cat > .env << EOL
# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=your_secret_key_here
EOL
    echo "   ✅ .env 파일 생성됨 (실제 Secret Key로 교체하세요)"
fi

echo ""
echo "🎉 설정이 완료되었습니다!"
echo ""
echo "📋 다음 단계:"
echo "   1. Cloudflare Dashboard에서 Turnstile 사이트 등록"
echo "   2. .env 파일의 TURNSTILE_SECRET_KEY를 실제 키로 교체"
echo "   3. API 엔드포인트에 Turnstile 검증 추가:"
echo ""
echo "      const { turnstileMiddleware } = require('./turnstile-verification');"
echo ""
echo "      app.post('/report', "
echo "        upload.array('photos'), "
echo "        turnstileMiddleware({ tokenField: 'turnstileToken' }),"
echo "        async (req, res) => {"
echo "          // 비즈니스 로직..."
echo "        }"
echo "      );"
echo ""
echo "   4. 동일하게 /notify 엔드포인트에도 적용"
echo ""
echo "📖 자세한 내용은 README.md를 참고하세요."
echo ""
echo "🔐 보안 수준: ⭐⭐⭐⭐⭐ (완벽한 봇 방어)"
echo "💰 비용: 월 100만 요청까지 완전 무료"
echo ""