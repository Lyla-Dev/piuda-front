import http from "@/api/http";

/**
 * 핀 데이터를 백엔드에서 가져오는 함수
 * @returns {Promise<Array>} 핀 데이터 배열
 */
export const fetchPins = async () => {
  try {
    const response = await http.get("/pins");
    return response.data;
  } catch (error) {
    console.warn("백엔드에서 핀 데이터를 불러올 수 없어 임시 데이터를 사용합니다:", error.message);

    // 임시 데이터 반환 (백엔드 준비될 때까지)
    return [
      {
        pinId: 1,
        x: 126.9784,
        y: 37.5666,
        title: "서울 중심부",
        content: "임시 핀 데이터 - 백엔드 연결 대기 중",
        createdAt: new Date().toISOString()
      },
      {
        pinId: 2,
        x: 129.0756,
        y: 35.1796,
        title: "부산 해운대",
        content: "임시 핀 데이터 - 백엔드 연결 대기 중",
        createdAt: new Date().toISOString()
      }
    ];
  }
};
