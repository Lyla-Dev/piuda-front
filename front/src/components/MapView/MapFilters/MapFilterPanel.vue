<template>
  <div class="filter-container">
    <div class="filter-panel" :class="{ open: isFilterOpen }">
      <div class="filter-content">
        <div class="filter-section">
          <h4>날짜 범위</h4>
          <div class="date-range-inline">
            <div class="date-input-group">
              <label>시작일</label>
              <input
                type="date"
                v-model="localFilters.startDate"
                :max="localFilters.endDate || null"
              />
            </div>

            <span class="date-separator">~</span>

            <div class="date-input-group">
              <label>종료일</label>
              <input
                type="date"
                v-model="localFilters.endDate"
                :min="localFilters.startDate || null"
              />
            </div>
          </div>
        </div>

        <div class="filter-section">
          <h4>단체명</h4>
          <div class="organization-grid">
            <label v-for="corp in corpList" :key="corp.name">
              <input
                type="checkbox"
                v-model="localFilters.orgs[makeSlug(corp.name)]"
              />
              {{ corp.name }}
            </label>
          </div>
        </div>

        <div class="filter-section">
          <h4>수거량</h4>
          <div class="quantity-options">
            <label
              ><input type="checkbox" v-model="localFilters.quantity.low" /> 0
              ~10</label
            >
            <label
              ><input type="checkbox" v-model="localFilters.quantity.mid" /> 10
              ~ 50</label
            >
            <label
              ><input type="checkbox" v-model="localFilters.quantity.high" /> 50
              ~ 100</label
            >
            <label
              ><input type="checkbox" v-model="localFilters.quantity.vhigh" />
              100 이상</label
            >
          </div>
        </div>

        <div class="filter-footer">
          <button class="reset-btn" @click="handleReset">필터 초기화</button>
        </div>
      </div>
    </div>

    <button class="filter-toggle-btn" @click="toggleFilter">
      <span class="filter-text">{{
        isFilterOpen ? "필터 접기" : "필터 펼치기"
      }}</span>
      <span class="toggle-arrow" :class="{ rotated: isFilterOpen }">▲</span>
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { corpList } from "@/assets/corpList";

const makeSlug = (name) =>
  name
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9가-힣]/g, "")
    .toLowerCase();

const props = defineProps({
  filters: {
    type: Object,
    required: true,
  },
  onReset: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(["update:filters"]);

const isFilterOpen = ref(false);

const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value;
};

const cloneFilters = (f) => JSON.parse(JSON.stringify(f || {}));
const localFilters = ref(cloneFilters(props.filters));

watch(
  () => props.filters,
  (newVal) => {
    localFilters.value = cloneFilters(newVal);
  },
  { deep: true, immediate: true }
);

watch(
  () => localFilters.value.startDate,
  (v) => emit("update:filters", { key: "startDate", value: v })
);

watch(
  () => localFilters.value.endDate,
  (v) => emit("update:filters", { key: "endDate", value: v })
);

watch(
  () => localFilters.value.orgs,
  (v) => emit("update:filters", { key: "orgs", value: v }),
  { deep: true }
);

watch(
  () => localFilters.value.quantity,
  (v) => emit("update:filters", { key: "quantity", value: v }),
  { deep: true }
);

const handleReset = () => {
  props.onReset();
  localFilters.value = cloneFilters(props.filters);
};
</script>

<style scoped>
.filter-container {
  position: absolute;
  bottom: 60px;
  left: 80px;
  z-index: 1000;
  width: 350px;
}

.filter-panel {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 350px;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  margin-bottom: 8px;
}

.filter-panel.open {
  max-height: calc(100vh - 250px);
  opacity: 1;
  transform: translateY(0);
  overflow-y: auto;
}

.filter-content {
  padding: 16px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section h4 {
  margin: 0 0 6px 0;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  padding-bottom: 4px;
  border-bottom: 1px solid #e0e0e0;
}

.filter-toggle-btn {
  background: white;
  border: 1px solid #ddd;
  border-radius: 22px;
  padding: 12px 20px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.2s ease;
  width: 100%;
  white-space: nowrap;
}

.filter-toggle-btn:hover {
  background: #f8f9fa;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.filter-text {
  flex: 1;
  text-align: center;
}

.toggle-arrow {
  font-size: 15px;
  color: #666;
  transition: transform 0.3s ease;
}

.toggle-arrow.rotated {
  transform: rotate(180deg);
}

.date-range-inline {
  display: flex;
  align-items: end;
  gap: 8px;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.date-input-group label {
  font-size: 15px;
  color: #666;
  font-weight: 400;
}

.date-input-group input[type="date"] {
  padding: 4px 10px;
  border: 1px solid #fff7f7;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 600;
  background: #fff7f7;
}

.date-separator {
  font-size: 15px;
  color: #666;
  margin: 0 4px;
  padding-bottom: 10px;
}

.organization-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 15px;
}

.organization-grid label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 15px;
  color: #555;
  cursor: pointer;
  padding: 1px 0;
}

.organization-grid input[type="checkbox"] {
  margin: 0;
  width: 14px;
  height: 14px;
}

.quantity-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px 15px;
}

.quantity-options label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #555;
  cursor: pointer;
}

.quantity-options input[type="checkbox"] {
  margin: 0;
  width: 15px;
  height: 15px;
}

.filter-footer {
  margin-top: 12px;
  padding-top: 12px;
  text-align: center;
}

.reset-btn {
  background: white;
  border: 1px solid white;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 15px;
  color: #7886c7;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.reset-btn:hover {
  background: white;
  font-weight: 700;
  text-decoration: underline;
}
</style>
