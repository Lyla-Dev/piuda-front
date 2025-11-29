<template>
  <div class="list-card-wrapper">
    <div class="header-row">
      <h2>{{ title }}</h2>
      <button v-if="editable" class="edit-btn">편집하기</button>
    </div>

    <table class="list">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.label" :style="col.width ? `width: ${col.width}` : ''">
            {{ col.label }}
          </th>
          <th v-if="showActionCol"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(row, index) in contents" :key="index">
          <td v-for="col in columns" :key="col.key" class="cell" :style="col.width ? `width: ${col.width}` : ''">
            <span
              v-if="col.key === 'status'"
              :class="['status-chip', statusClass(row[col.key])]"
            >
              {{ statusLabel(row[col.key]) }}
            </span>

            <div v-else-if="col.key === 'photo' && actions && actions.length > 0" class="photo-col">
              <button 
                v-for="action in actions.filter(a => a.key === 'photo')" 
                :key="action.key"
                class="photo-btn"
                @click="action.action(row)"
              >
                {{ action.label }}
              </button>
            </div>

            <div v-else-if="col.key === 'action' && actions && actions.length > 0" class="action-col">
              <div class="action-buttons">
                <button 
                  v-for="action in actions.filter(a => a.key !== 'photo')" 
                  :key="action.key"
                  :class="action.key === 'approve' ? 'approve-btn' : 'reject-btn'"
                  @click="action.action(row)"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>

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
    showActionCol: {
      type: Boolean,
      default: false,
    },
    actions: {
      type: Array,
      default: () => [],
    },
  },

  emits: ["approve", "reject"],

  data() {
    return {
      ReportStatus,
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
      row._resolved = true;
      row.status = ReportStatus.APPROVED;
    },

    reject(row) {
      this.$emit("reject", row);
      row._resolved = true;
      row.status = ReportStatus.REJECTED;
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
  width: 25%;
}

.list td {
  padding: 16px 8px;
  border-bottom: 1px solid #f2f2f2;
  width: 25%;
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
  font-weight: 300;
}

.status-pending {
  background-color: #5f7bff;
  color: #fff;
}

.status-approved {
  background-color: #53a54d;
  color: #fff;
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
  padding: 8px 20px;
  border-radius: 14px;
  border: 1px solid #fff;
  background: #c3dfc1;
  cursor: pointer;
  font-size: 16px;
  min-width: 70px;
  white-space: nowrap;
}

.reject-btn {
  padding: 8px 20px;
  border-radius: 14px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  font-size: 16px;
  min-width: 70px;
  white-space: nowrap;
}

.approve-btn:hover,
.reject-btn:hover {
  border: 1px solid #000;
}

.photo-col {
  text-align: left;
}

.photo-btn {
  padding: 6px 14px;
  border-radius: 14px;
  border: 1px solid #3b82f6;
  background: #eff6ff;
  color: #3b82f6;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.photo-btn:hover {
  background: #3b82f6;
  color: white;
}
</style>
