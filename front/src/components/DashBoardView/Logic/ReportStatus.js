export const ReportStatus = Object.freeze({
  PENDING: "PENDING", // 승인 대기
  APPROVED: "APPROVED", // 승인 완료
  REJECTED: "REJECTED", // 승인 거절
});

// 화면에 표시할 라벨
export const ReportStatusLabel = {
  [ReportStatus.PENDING]: "승인 대기",
  [ReportStatus.APPROVED]: "승인 완료",
  [ReportStatus.REJECTED]: "승인 거절",
};

// 색상 클래스
export const ReportStatusClass = {
  [ReportStatus.PENDING]: "status-pending",
  [ReportStatus.APPROVED]: "status-approved",
  [ReportStatus.REJECTED]: "status-rejected",
};
