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
  <!-- ✅ 1) 활동 위치 및 시간 블럭 -->
  <div class="section-block">
    <p class="section-caption">활동 위치 및 시간</p>

    <div class="info-row">
      <span class="info-label">활동 장소</span>
      <span class="info-value">{{ review.info.split('|')[0].trim() }}</span>
    </div>

    <div v-if="review.lat && review.lng" class="map-wrapper">
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
      <span class="info-value">{{ review.locationDetail || '-' }}</span>
    </div>
  </div>

  <!-- ✅ 2) 쓰레기 정보 블럭 -->
  <div class="section-block">
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
      <span class="info-value">{{ review.trashTypes || '-' }}</span>
    </div>

    <div class="divider"></div>

    <div class="info-row">
      <span class="info-label">상세 설명</span>
      <span class="info-value info-description">{{ review.content }}</span>
    </div>
  </div>
</section>

    </main>

    <main class="detail-container" v-else>
      <p>존재하지 않는 후기입니다.</p>
    </main>
  </div>
</template>

<script>
import http from '@/api/http';

const clientId = process.env.VUE_APP_NAVER_MAP_CLIENT_ID; // 신고서에서 쓰던 키 그대로

export default {
  name: 'ReviewDetail',
  props: ['id'],
  data() {
    return {
      review:null,
      loading: false,
      error: null,
      currentImageIndex: 0,
      isScrapped: false,
      map: null,
      marker: null,
    };
  },
    
  watch: {
    id() {
      this.currentImageIndex = 0;
      this.fetchReviewDetail();
    },
    review() {
      this.$nextTick(()=> this.setupMap())
    }

  },
  mounted() {
    this.fetchReviewDetail();
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
      
    },

    async fetchReviewDetail() {
    try {
      this.loading = true;

      const res = await http.get(`/report/${this.id}`);
      const data = res.data;

      const trashTypesMap = {
            '페트병': data.trashPet,
            '봉투': data.trashBag,
            '그물': data.trashNet,
            '유리': data.trashGlass,
            '캔': data.trashCan,
            '로프': data.trashRope,
            '천조각': data.trashCloth,
            '전자제품': data.trashElec,
            '기타': data.trashEtc,
        };

        const trashTypesArray = Object.entries(trashTypesMap)
            .filter(([, count]) => count > 0)
            .map(([type, count]) => `${type}: ${count}개`);

        const formattedTrashTypes = trashTypesArray.length 
            ? trashTypesArray.join(', ') 
            : '-';

      this.review = {
        activity: data.reportTitle,
        team: data.reportName || data.writerName,
        images: data.photoUrls || [],
        info: `${data.reportName} | ${data.reportDate}`,
        content: data.reportContent || '',
        locationDetail: data.reportDetailLocation || '-',
        amount: data.trashKg || null,
        volume: data.trashL || null,
        trashTypes: formattedTrashTypes, 
        lat: data.pinY || null, 
        lng: data.pinX || null,
        
      };
        if (!this.review.activity) { 
            this.review = null;
        }
      
    } catch (e) {
      this.error = '후기를 불러오지 못했습니다.';
      console.error(e);
      this.review = null;
    } finally {
      this.loading = false;
    }
  },

  },


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
  margin-top: 20px;
  color: #333;
  line-height: 1.7;
  white-space: pre-line;
}

.section-caption {
  margin-top: 32px;
  font-size: 18px;
  font-weight: 600;
  color: #555;
}

.detail-card .section-caption:first-of-type {
  margin-top: 10px;
}

.map-wrapper {
  margin: 12px 0 12px 145px;
  width: 100%;
  max-width: 600px;
  
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

/* 바깥 컨테이너는 배경만 깔끔하게 */
.detail-card{
  background: transparent;
  padding: 0;
  box-shadow: none;
}

/* 섹션 박스 2개 */
.section-block{
  background: #fff;
  border-radius: 16px;
  padding: 28px 32px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.04);
}

/* 두 박스 사이 간격 */
.section-block + .section-block{
  margin-top: 18px;
}

/* 섹션 제목 */
.section-caption{
  margin: 0 0 18px;
  font-size: 18px;      /* 원하면 더 키워도 됨 */
  font-weight: 800;
  color: #222;
}


</style>
