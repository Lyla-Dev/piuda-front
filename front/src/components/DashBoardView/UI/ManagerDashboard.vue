<template>
  <div class="manager-wrapper">
    <!-- 바살넷 관리자 대시보드입니다. -->
    <ListCard
      title="시민 제보 현황"
      :columns="[
        { label: '제보 ID', key: 'reportId' },
        { label: '신고일', key: 'reportDate' },
        { label: '상태', key: 'status' },
        { label: '', key: 'action' },
      ]"
      :contents="notifies"
      :showActionCol="true"
      @approve="handleApprove"
      @reject="handleReject"
    />

    <!-- API 적용 코드 -->
    <!-- <ListCard
      v-else
      title="단체 관리 페이지"
      :columns="[
          { label: '제보 ID', key: 'reportId' },
          { label: '신고일', key: 'reportDate' },
          { label: '상태', key: 'status' },
          { label: '', key: 'action' }
        ]"
      :contents="notifies"
    /> -->

    <ListCard
      title="단체 관리 페이지"
      :editable="true"
      :columns="[
        { label: '단체 이름', key: 'name' },
        { label: '대표자 이름', key: 'ceo' },
        { label: '대표자 이메일', key: 'email' },
        { label: '주요활동권역', key: 'region' },
      ]"
      :contents="corpList"
    />
  </div>
</template>

<script>
import ListCard from "@/components/DashBoardView/Components/ListCard.vue";
import {
  ReportStatus,
  ReportStatusLabel,
  ReportStatusClass,
} from "@/components/DashBoardView/Logic/ReportStatus";
import { corpList } from "@/components/DashBoardView/Data/corpList.js";

export default {
  components: { ListCard },

  methods: {
    statusLabel(status) {
      return ReportStatusLabel[status] || "";
    },
    statusClass(status) {
      return ReportStatusClass[status] || "";
    },

    async handleApprove(row) {
      try {
        await fetch(`/api/reports/${row.reportId}/accept`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        row.status = ReportStatus.APPROVED;
        alert("승인 완료!");
      } catch (e) {
        console.error(e);
        alert("승인 처리 실패");
      }
    },

    async handleReject(row) {
      try {
        await fetch(`/api/reports/${row.reportId}/reject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        row.status = ReportStatus.REJECTED;
        alert("거절 완료!");
      } catch (e) {
        console.error(e);
        alert("거절 처리 실패");
      }
    },
  },

  data() {
    return {
      corpList,
      notifies: [
        {
          reportId: 5,
          reportDate: "2025.10.09",
          status: ReportStatus.PENDING,
        },
        {
          reportId: 4,
          reportDate: "2025.10.09",
          status: ReportStatus.PENDING,
        },
        {
          reportId: 3,
          reportDate: "2025.10.09",
          status: ReportStatus.APPROVED,
        },
        {
          reportId: 2,
          reportDate: "2025.10.09",
          status: ReportStatus.APPROVED,
        },
        {
          reportId: 1,
          reportDate: "2025.10.09",
          status: ReportStatus.REJECTED,
        },
      ],
    };
  },

  // 추후 제보 api 연결 시 사용할 코드
  //     data() {
  //   return {
  //     notifies: [],
  //     loading: true,
  //     error: null
  //   }
  // },

  // async created() {
  //   try {
  //     const res = await fetch('/api/notify')  // 나중에 실제 API 엔드포인트로 변경
  //     const data = await res.json()

  //     this.notifies = data
  //   } catch (err) {
  //     this.error = err
  //     console.error("API ERROR:", err)
  //   } finally {
  //     this.loading = false
  //   }
  // }
};
</script>

<style scoped>
.manager-wrapper {
  background-color: #f4f6fb;
  min-height: 100vh;
  padding: 24px 20px;
}
</style>
