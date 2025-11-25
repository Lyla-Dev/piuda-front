<template>
  <div class="result-card">
    <div class="stat-header">
      <span class="stat-title">{{ title }}</span>
      <span
        class="stat-delta"
        :class="{ positive: delta > 0, negative: delta < 0 }"
      >
        {{ delta > 0 ? `+${delta}%` : `${delta}%` }}
      </span>
    </div>

    <div class="stat-result">{{ result }}개</div>
  </div>
</template>

<script>
export default {
  name: "StatCard",
  props: {
    title: {
      type: String,
      required: true,
    },
    delta: {
      type: Number,
      required: true,
    },
    result: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.result-card {
  width: 160px;
  height: 70px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-title {
  font-size: 14px;
  color: #444;
}

.stat-delta {
  font-size: 12px;
}

.stat-delta.positive {
  color: #ff0000;
}

.stat-delta.negative {
  color: #0000ff;
}

.stat-result {
  font-size: 28px;
  font-weight: 600;
  margin-top: 15px;
  color: #2d336b;
}
</style>
