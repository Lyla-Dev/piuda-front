<template>
  <div class="detail-page">
    <main class="detail-container" v-if="review">
      <!-- 상단 히어로 영역 (제목 + 사진) -->
      <section class="detail-hero">
        <div class="hero-header">
          <h1 class="hero-title">{{ review.activity }}</h1>

          <button class="scrap-btn" @click="toggleScrap">
            {{ isScrapped ? '⭐ 스크랩됨' : '☆ 스크랩하기' }}
          </button>
        </div>

        <p class="hero-team">{{ review.team }}</p>

        <div class="hero-images">
          <template v-if="review.images && review.images.length">
            <!-- ✅ 1~2장: 그냥 나란히 -->
            <div v-if="review.images.length <= 2" class="hero-image-row">
              <div
                v-for="(img, idx) in review.images"
                :key="idx"
                class="image-wrapper"
              >
                <img :src="img" alt="활동 사진" class="hero-image" />
              </div>
            </div>

            <!-- ✅ 3장 이상: 2장 보이면서 1장씩 이동 -->
            <div v-else class="hero-carousel">
              <button class="carousel-btn" @click="prevImage">‹</button>

              <div class="carousel-window">
                <div
                  class="carousel-track"
                  :style="{ transform: 'translateX(-' + currentImageIndex * 50 + '%)' }"
                >
                  <div
                    v-for="(img, idx) in review.images"
                    :key="idx"
                    class="image-wrapper"
                  >
                    <img :src="img" alt="활동 사진" class="hero-image" />
                  </div>
                </div>
              </div>

              <button class="carousel-btn" @click="nextImage">›</button>
            </div>
          </template>

          <div v-else class="hero-image-placeholder">
            활동 사진을 등록해 주세요
          </div>
        </div>
      </section>

      <!-- 상세 정보 카드 -->
      <section class="detail-card">
        <!-- 섹션 1: 활동 위치 및 시간 -->
        <p class="section-caption">활동 위치 및 시간</p>

        <div class="info-row">
          <span class="info-label">활동 장소</span>
          <span class="info-value">
            {{ review.info.split('|')[0].trim() }}
          </span>
        </div>

        <!-- ⭐ 여기에서 지도 표시 -->
        <div
          v-if="review.lat && review.lng"
          class="map-wrapper"
        >
          <div ref="detailMap" class="detail-map"></div>
        </div>

        <div class="divider"></div>

        <div class="info-row">
          <span class="info-label">활동 일시</span>
          <span class="info-value">
            {{ review.info.split('|')[1] && review.info.split('|')[1].trim() }}
          </span>
        </div>

        <div class="divider"></div>

        <div class="info-row">
          <span class="info-label">상세 위치</span>
          <span class="info-value">
            {{ review.locationDetail || '-' }}
          </span>
        </div>

        <div class="divider divider-section"></div>

        <!-- 섹션 2: 쓰레기 정보 -->
        <p class="section-caption">쓰레기 정보</p>

        <div class="info-row">
          <span class="info-label">무게 / 부피</span>
          <span class="info-value">
            <template v-if="review.amount || review.volume">
              <span v-if="review.amount">{{ review.amount }}kg</span>
              <span v-if="review.amount && review.volume"> / </span>
              <span v-if="review.volume">{{ review.volume }}L</span>
            </template>
            <span v-else>-</span>
          </span>
        </div>

        <div class="divider"></div>

        <div class="info-row">
          <span class="info-label">쓰레기 종류</span>
          <span class="info-value">
            {{ review.trashTypes || '-' }}
          </span>
        </div>

        <div class="divider divider-section"></div>

        <div class="info-row">
          <span class="info-label">상세 설명</span>
          <span class="info-value info-description">
            {{ review.content }}
          </span>
        </div>
      </section>

    </main>

    <main class="detail-container" v-else>
      <p>존재하지 않는 후기입니다.</p>
    </main>
  </div>
</template>

<script>
import reviewImg1 from '@/assets/reviewdetail1.png';
import reviewImg2 from '@/assets/reviewdetail2.png';
import reviewImg3 from '@/assets/reviewdetail3.png';

const clientId = process.env.VUE_APP_NAVER_MAP_CLIENT_ID; // 신고서에서 쓰던 키 그대로

export default {
  name: 'ReviewDetail',
  props: ['id'],
  data() {
    return {
      isScrapped: false,
      currentImageIndex: 0,
      map: null,
      marker: null,
      // 🔻 지금은 예시로 하드코딩, 나중에는 백엔드 응답으로 교체하면 됨
      reviews: [
        {
          id: 1,
          team: "디프다제주",
          activity: "해안 쓰레기 줍기 활동",
          info: "인천 해안 | 2025.10",
          content: "인천 해안을 함께 걸으며 플로깅을 진행했습니다. 생각보다 많은 쓰레기를 보며 충격을 받았지만, 팀원들과 함께 정화 활동을 하며 보람을 느꼈습니다.",
          images: [reviewImg1, reviewImg2, reviewImg3],
          lat: 37.458,      // ⭐ 예시 좌표 (백엔드에서 들어왔다고 가정)
          lng: 126.705,
          locationDetail: "인천 ○○해변 산책로 구간",
          amount: "18",
          volume: "40",
          trashTypes: "플라스틱, 페트병, 스티로폼, 어구"
        },
        {
          id: 2,
          team: "봉그젠",
          activity: "신진 활동가 양성 프로젝트",
          info: "제주 해안 | 2025.09",
          content: "해양 환경 교육과 함께 실제 정화 활동을 병행한 프로젝트였습니다.",
          images: [reviewImg1, reviewImg2]
          // lat/lng 없으니 지도 안 나옴
        },
        {
          id: 3,
          team: "쓰담속초",
          activity: "심해 쓰레기 수거 활동",
          info: "속초 해안 | 2025.08.21",
          content: "심해 쓰레기 수거 과정을 직접 보고, 우리가 버린 쓰레기가 결국 다시 우리에게 돌아온다는 사실을 체감했습니다.",
          amount: "24kg",
          images: [
            "https://images.pexels.com/photos/2774301/pexels-photo-2774301.jpeg",
            "https://images.pexels.com/photos/4558800/pexels-photo-4558800.jpeg"
          ]
        },
        {
          id: 4,
          team: "쓰줍인",
          activity: "해안 쓰레기 줍기 활동",
          info: "인천 해안 | 2025.10",
          content: "가족 단위 참여자가 많아 아이들과 환경에 대해 이야기 나눌 수 있어 좋았습니다.",
          images: []
        }
      ]
    };
  },
  computed: {
    review() {
      const idNum = Number(this.id);
      return this.reviews.find((r) => r.id === idNum) || null;
    }
  },
  watch: {
    id() {
      this.currentImageIndex = 0;
      this.$nextTick(() => this.setupMap());
    },
    review() {
      // review 데이터가 바뀌면 지도도 다시 그림
      this.$nextTick(() => this.setupMap());
    }
  },
  mounted() {
    this.$nextTick(() => this.setupMap());
  },
  methods: {
    toggleScrap() {
      this.isScrapped = !this.isScrapped;
    },
    nextImage() {
      if (!this.review || !this.review.images) return;
      const len = this.review.images.length;
      const maxIndex = len - 2;
      if (this.currentImageIndex >= maxIndex) {
        this.currentImageIndex = 0;
      } else {
        this.currentImageIndex += 1;
      }
    },
    prevImage() {
      if (!this.review || !this.review.images) return;
      const len = this.review.images.length;
      const maxIndex = len - 2;
      if (this.currentImageIndex <= 0) {
        this.currentImageIndex = maxIndex;
      } else {
        this.currentImageIndex -= 1;
      }
    },

    async setupMap() {
      if (!this.review || !this.review.lat || !this.review.lng) return;
      try {
        await this.loadNaverMapAPI();
        this.initMap();
      } catch (e) {
        console.error('네이버 지도 API 로드 실패', e);
      }
    },

    loadNaverMapAPI() {
      return new Promise((resolve, reject) => {
        if (window.naver && window.naver.maps) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
        script.onload = () => resolve();
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
      });
    },

    initMap() {
      if (!window.naver || !window.naver.maps) {
        console.error('네이버 지도 API가 없습니다.');
        return;
      }

      const container = this.$refs.detailMap;
      if (!container) return;

      const center = new window.naver.maps.LatLng(this.review.lat, this.review.lng);

      if (!this.map) {
        this.map = new window.naver.maps.Map(container, {
          center,
          zoom: 16,
          mapTypeControl: false,
          scaleControl: true,
          logoControl: true,
          mapDataControl: true
        });
      } else {
        this.map.setCenter(center);
      }

      // 마커 갱신
      if (this.marker) {
        this.marker.setMap(null);
      }
      this.marker = new window.naver.maps.Marker({
        position: center,
        map: this.map
      });
    }
  }
};
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background-color: #F0F1F6;
  padding: 40px 20px;
}
.detail-container {
  max-width: 900px;
  margin: 0 auto;
}
/* 상단 히어로 영역 */
.detail-hero {
  text-align: center;
  margin-bottom: 32px;
}
/* 제목 + 스크랩 버튼 묶는 헤더 */
.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
/* 제목 */
.hero-title {
  font-size: 28px;
  font-weight: 600;
  color: #222;
}
/* 팀 */
.hero-team {
  font-size: 14px;
  color: #777;
  margin-bottom: 24px;
}
/* 스크랩 버튼 스타일 */
.scrap-btn {
  padding: 8px 14px;
  font-size: 14px;
  border: 1px solid #d0d0d0;
  border-radius: 999px;
  background: #ffffff;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}
.scrap-btn:hover {
  background: #f5f5f5;
  transform: translateY(-1px);
}
/* 이미지 영역 공통 */
.hero-images {
  display: flex;
  justify-content: center;
}
/* 1~2장일 때: 옆으로 나란히 */
.hero-image-row {
  display: flex;
  justify-content: center;
  max-width: 880px;
  width: 100%;
}
/* 이미지 한 장 컨테이너 (슬라이더 / 1~2장 공통) */
.image-wrapper {
  flex: 0 0 50%;
  max-width: 50%;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}
/* 실제 이미지 – 비율 유지, 절대 안 잘리게 */
.hero-image {
  width: 90%;
  height: auto;
  border-radius: 40px;
  display: block;
  object-fit: contain;
}
/* 3장 이상: 2장 보이는 슬라이더 */
.hero-carousel {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 900px;
}
.carousel-window {
  flex: 1;
  overflow: hidden;
}
.carousel-track {
  display: flex;
  transition: transform 0.3s ease;
}
/* 좌우 버튼 */
.carousel-btn {
  border: none;
  background: rgba(255, 255, 255, 0.9);
  width: 32px;
  height: 32px;
  border-radius: 999px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-btn:hover {
  background: #f5f5f5;
}
/* 이미지 없을 때 */
.hero-image-placeholder {
  width: 100%;
  max-width: 680px;
  height: 260px;
  border-radius: 24px;
  background: #e9e9e9;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}
/* 상세 정보 카드 */
.detail-card {
  background: #fff;
  border-radius: 12px;
  padding: 8px 40px 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.info-row {
  display: flex;
  align-items: center;
  padding: 14px 0;
  font-size: 14px;
}
.info-label {
  flex: 0 0 110px;
  text-align: left;
  color: #777;
}
.info-value {
  flex: 1;
  text-align: center;
  color: #333;
}
.divider {
  width: 100%;
  height: 1px;
  background-color: #e5e5e5;
}
.info-description {
  margin-top: 12px;
  color: #333;
  line-height: 1.7;
  white-space: pre-line;
}

.section-caption {
  margin-top: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.detail-card .section-caption:first-of-type {
  margin-top: 4px;
}

.map-wrapper {
  margin-top: 8px;
  margin-bottom: 12px;
  border-radius: 18px;
  overflow: hidden;
  background: #f3f4f8;
}

.detail-map {
  width: 100%;
  height: 260px;
}

.divider-section {
  margin-top: 8px;
}
</style>
