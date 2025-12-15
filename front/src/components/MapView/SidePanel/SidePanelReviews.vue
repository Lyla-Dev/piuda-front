<template>
  <section class="section">
    <h3 class="section-title">활동 후기</h3>
    <p v-if="!props.reviewLogs || !props.reviewLogs.length" class="empty-text">
      아직 등록된 활동 후기가 없어요.
    </p>
    <ul v-else class="review-list">
      <li
        v-for="log in sortedLogs"
        :key="log.reportId"
        class="review-card"
        @click="goToReview(log.id)"
      >
        <div class="review-info">
          <h4 class="review-title">{{ log.title }}</h4>
          <p class="review-meta">{{ log.date }} · {{ log.orgName }}</p>
          <p class="review-desc">{{ log.description }}</p>
        </div>
        <div v-if="log.thumbnailUrl" class="review-thumb-wrap">
          <img 
            class="review-thumb" 
            :src="log.thumbnailUrl" 
            :alt="log.title" 
            @load="handleImageLoad(log)"
            @error="handleImageError(log)"
          />
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { useRouter } from "vue-router";
import { computed } from "vue";

const props = defineProps({
  reviewLogs: {
    type: Array,
    default: () => [],
  },
});

const router = useRouter();
const goToReview = (reportId) => {
  router.push(`api/report/${reportId}`);
};

const sortedLogs = computed(() => {
  return [...props.reviewLogs].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
});

const handleImageLoad = (log) => {
  console.log('✅ 후기 이미지 로드 성공:', {
    title: log.title,
    url: log.thumbnailUrl
  });
};

const handleImageError = (log) => {
  console.error('❌ 후기 이미지 로드 실패:', {
    title: log.title,
    url: log.thumbnailUrl,
    message: 'presigned URL 만료 또는 잘못된 URL'
  });
};
</script>

<style scoped>
.section-title {
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #333;
}

.empty-text {
  font-size: 12px;
  color: #888;
}

.review-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.review-card {
  display: flex;
  background: #ffffff;
  border-radius: 16px;
  padding: 12px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: background 0.15s ease;
  align-items: center;
}
.review-card + .review-card {
  margin-top: 12px;
}
.review-card:hover {
  background: #f7f7f7;
}

.review-info {
  flex: 1;
  min-width: 0;
  padding-right: 10px;
}

.review-title {
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 6px;
  color: #333;
}

.review-meta {
  font-size: 11px;
  color: #888;
  margin-bottom: 6px;
}

.review-desc {
  font-size: 12px;
  color: #000;
  line-height: 1.45;
  display: -webkit-box;
  display: box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  box-orient: vertical;
}

.review-thumb-wrap {
  width: 88px;
  height: 88px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.review-thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
