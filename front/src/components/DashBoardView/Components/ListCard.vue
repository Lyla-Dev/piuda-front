<template>
  <div class="list-card-wrapper">
    <div class="header-row">
      <h2>{{ title }}</h2>
      <button v-if="editable" class="edit-btn">편집하기</button>
    </div>

    <table class="list">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.label">
            {{ col.label }}
          </th>
          <!-- 오른쪽 버튼 칼럼 헤더는 비워둠 -->
          <th v-if="showActionCol"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, index) in contents" :key="index">
          <td v-for="col in columns" :key="col.key" class="cell">
            <!-- 상태 칩 -->
            <span
              v-if="col.key === 'status'"
              :class="['status-chip', statusClass(row[col.key])]"
            >
              {{ statusLabel(row[col.key]) }}
            </span>

            <!-- 승인/거절 버튼 -->
            <div v-else-if="col.key === 'action'" class="action-col">
              <div
                v-if="row.status === ReportStatus.PENDING && !row._resolved"
                class="action-buttons"
              >
                <button class="approve-btn" @click="approve(row)">승인</button>
                <button class="reject-btn" @click="reject(row)">거절</button>
              </div>
              <div v-else></div>
            </div>

            <!-- 일반 텍스트 -->
            <span v-else>
              {{ row[col.key] }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import {
  ReportStatus,
  ReportStatusLabel,
  ReportStatusClass,
} from "@/components/DashBoardView/Logic/ReportStatus";

export default {
  name: "ListCard",
  props: {
    title: String,
    columns: Array,
    contents: Array,
    editable: Boolean,
    // 이 카드에서 우측 버튼 칼럼을 쓸지 여부 (시민 제보에만 true)
    showActionCol: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["approve", "reject"],

  data() {
    return {
      ReportStatus, // 템플릿에서 직접 사용
    };
  },

  methods: {
    statusLabel(status) {
      return ReportStatusLabel[status] || "";
    },
    statusClass(status) {
      return ReportStatusClass[status] || "";
    },

    approve(row) {
      this.$emit("approve", row);
      row._resolved = true; // 버튼 숨기기
      row.status = ReportStatus.APPROVED; // 상태 변경
    },

    reject(row) {
      this.$emit("reject", row);
      row._resolved = true; // 버튼 숨기기
      row.status = ReportStatus.REJECTED; // 상태 변경
    },
  },
};
</script>

<style scoped>
.list-card-wrapper {
  background: white;
  padding: 24px;
  border-radius: 16px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 24px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
}

.edit-btn {
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 12px;
  padding: 6px 16px;
  cursor: pointer;
  font-size: 14px;
}

.list {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.list th {
  font-weight: 600;
  text-align: left;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.list td {
  padding: 16px 0;
  border-bottom: 1px solid #f2f2f2;
}

.list tr:last-child td {
  border-bottom: none;
}

/* 상태 칩 */
.status-chip {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-pending {
  background-color: #5f7bff;
  color: #000;
}

.status-approved {
  background-color: #53a54d;
  color: #000;
}

.status-rejected {
  background-color: #d4d4d4;
  color: #000;
}

/* 버튼 칼럼 */
.action-col {
  text-align: right;
  width: 130px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.approve-btn {
  padding: 6px 14px;
  border-radius: 14px;
  border: 1px solid #fff;
  background: #c3dfc1;
  cursor: pointer;
  font-size: 16px;
}

.reject-btn {
  padding: 6px 14px;
  border-radius: 14px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  font-size: 16px;
}

.approve-btn:hover,
.reject-btn:hover {
  border: 1px solid #000;
}
</style>
