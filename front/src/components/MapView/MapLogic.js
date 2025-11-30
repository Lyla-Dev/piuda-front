import { ref, reactive, watch } from "vue";
// import { fetchPinsWithFilters } from "./MapApi";

import redPinImg from "@/assets/redpin.png";
import bluePinImg from "@/assets/bluepin.png";
import greenPinImg from "@/assets/greenpin.png";
import reviewImageEx from "@/assets/reviewImageEx.png";

export function useMapLogic() {
  const map = ref(null);
  const pins = ref([]); // 핀 데이터 상태
  const markers = ref([]); // 지도 마커 상태
  const selectedPin = ref(null); // 선택된 핀 정보
  const selectedMarker = ref(null); // 선택된 마커 참조

  // 필터 상태
  const filters = reactive({
    startDate: "2025-10-09",
    endDate: "2025-10-09",
    orgs: {
      dft: false,
      ocean: false,
      busan: false,
      covo: false,
      ssdamsokcho: false,
      jigu: false,
      sseom: false,
      cleanup: false,
      ecoteam: false,
      ocean_protect: false,
      project: false,
      environment: false,
      plog: false,
      leader: false,
      plogkorea: false,
      bakaji: false,
      team: false,
      jeju: false,
      honey: false,
      sea: false,
      other: false,
    },
    regions: {
      west: false,
      east: false,
      south: false,
      jeju: false,
      inland: false,
    },
    quantity: {
      low: false,
      mid: false,
      high: false,
      vhigh: false,
    },
  });

  // 네이버 지도 API 키
  const clientId = process.env.VUE_APP_NAVER_MAP_CLIENT_ID;

  // 네이버 지도 API 로드
  const loadNaverMapAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.naver && window.naver.maps) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;

      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const resizeMarker = (marker, isSelected) => {
    const icon = marker.getIcon();
    if (icon) {
      const size = isSelected ? 48 : 32; // 선택 시 더 크게
      icon.size = new window.naver.maps.Size(size, size);
      icon.scaledSize = new window.naver.maps.Size(size, size);
      icon.anchor = new window.naver.maps.Point(size / 2, size);
      marker.setIcon(icon);
    }
  };

  const onMarkerClick = (pin, marker) => {
    if (selectedMarker.value) {
      resizeMarker(selectedMarker.value, false);
    }

    resizeMarker(marker, true);

    selectedPin.value = pin;
    selectedMarker.value = marker;
  };

  const closeModal = () => {
    if (selectedMarker.value) {
      resizeMarker(selectedMarker.value, false);
    }

    selectedPin.value = null;
    selectedMarker.value = null;
  };

  const renderMarkers = () => {
    markers.value.forEach((marker) => marker.setMap(null));
    markers.value = [];
    if (!map.value) return;

    pins.value.forEach((pin) => {
      if (pin.pinY && pin.pinX) {
        let icon = null;
        if (pin.pinColor) {
          const color = pin.pinColor.toLowerCase();
          if (color === "red") {
            icon = {
              url: redPinImg,
              size: new window.naver.maps.Size(32, 32),
              scaledSize: new window.naver.maps.Size(32, 32),
              origin: new window.naver.maps.Point(0, 0),
              anchor: new window.naver.maps.Point(16, 32),
            };
          } else if (color === "blue") {
            icon = {
              url: bluePinImg,
              size: new window.naver.maps.Size(32, 32),
              scaledSize: new window.naver.maps.Size(32, 32),
              origin: new window.naver.maps.Point(0, 0),
              anchor: new window.naver.maps.Point(16, 32),
            };
          } else if (color === "green") {
            icon = {
              url: greenPinImg,
              size: new window.naver.maps.Size(32, 32),
              scaledSize: new window.naver.maps.Size(32, 32),
              origin: new window.naver.maps.Point(0, 0),
              anchor: new window.naver.maps.Point(16, 32),
            };
          }
        }

        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(pin.pinY, pin.pinX),
          map: map.value,
          title: pin.title || pin.pinId?.toString() || "",
          ...(icon ? { icon } : {}),
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
          onMarkerClick(pin, marker);
        });

        markers.value.push(marker);
      }
    });
  };

  const buildFilterParams = (filters) => {
    const params = {};

    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;

    const selectedOrgs = Object.keys(filters.orgs).filter(
      (key) => filters.orgs[key]
    );
    if (selectedOrgs.length > 0) params.organizations = selectedOrgs;

    const regionMapping = {
      west: "WEST_SEA",
      east: "EAST_SEA",
      south: "SOUTH_SEA",
      jeju: "JEJU",
      inland: "ULLEUNG",
    };
    const selectedRegions = Object.keys(filters.regions)
      .filter((key) => filters.regions[key])
      .map((key) => regionMapping[key] || key);
    if (selectedRegions.length > 0) params.regions = selectedRegions;

    // 수거량 (체크된 항목들을 배열로)
    const selectedQuantities = Object.keys(filters.quantity).filter(
      (key) => filters.quantity[key]
    );
    if (selectedQuantities.length > 0) params.quantities = selectedQuantities;

    console.log("Filter params:", params); // 디버깅용 로그
    return params;
  };

  const loadPins = async () => {
    try {
      const filterParams = buildFilterParams(filters);
      console.log("Requesting pins with filters:", filterParams); // 디버깅용 로그
      // pins.value = normalizePins(await fetchPinsWithFilters(filterParams));
      pins.value = normalizePins([
        {
          pinId: 1,
          pinX: 126.9784,
          pinY: 37.5665,
          pinColor: "BLUE",

          totalTrashKg: 19.5,
          totalTrashL: 11.5,

          reports: [
            {
              reportId: 1,
              reportTitle: "서해 정화 활동",
              reportName: "OrgA",
              reportDate: "2025-10-27",
              trashKg: 12.5,
              trashL: 8.0,
              reportContent:
                "즐거운 시간이었습니다.즐거운 시간이었습니다.즐거운 시간이었습니다.즐거운 시간이었습니다.",
              photoPaths: [reviewImageEx],
            },
            {
              reportId: 2,
              reportTitle: "서해 해변 클린업",
              reportName: "OrgB",
              reportDate: "2025-10-29",
              trashKg: 7.0,
              trashL: 3.5,
              reportContent:
                "즐거운 시간이었습니다.즐거운 시간이었습니다.즐거운 시간이었습니다.즐거운 시간이었습니다.즐거운 시간이었습니다.즐거운 시간이었습니다.즐거운 시간이었습니다.",
              photoPaths: [reviewImageEx],
            },
          ],
        },
        {
          pinId: 2,
          pinX: 129.075,
          pinY: 35.1796,
          pinColor: "RED",

          totalTrashKg: 0,
          totalTrashL: 0,

          reports: [],
        },
        {
          pinId: 3,
          pinX: 126.52,
          pinY: 33.4996,
          pinColor: "GREEN",

          totalTrashKg: 5.0,
          totalTrashL: 2.0,

          reports: [
            {
              reportId: 1,
              reportTitle: "서해 정화 활동",
              reportName: "OrgA",
              reportDate: "2025-10-27",
              trashKg: 12.5,
              trashL: 8.0,
              reportContent:
                "즐거운 시간이었습니다.즐거운 시간이었습니다.즐거운 시간이었습니다.즐거운 시간이었습니다.즐거운 시간이었습니다.즐거운 시간이었습니다.즐거운 시간이었습니다.",
              photoPaths: [reviewImageEx],
            },
            {
              reportId: 2,
              reportTitle: "서해 해변 클린업",
              reportName: "OrgB",
              reportDate: "2025-10-29",
              trashKg: 7.0,
              trashL: 3.5,
              reportContent: null,
              photoPaths: [reviewImageEx],
            },
          ],
        },
      ]);
      // console.log("Received pins:", pins.value); // 디버깅용 로그
      renderMarkers();
    } catch (e) {
      console.error("핀 데이터 불러오기 실패:", e);
    }
  };

  // 지도 초기화
  const initializeMap = () => {
    if (!window.naver || !window.naver.maps) {
      console.error("네이버 지도 API가 로드되지 않았습니다.");
      return;
    }
    const mapOptions = {
      center: new window.naver.maps.LatLng(36.5, 127.5),
      zoom: 7,
      mapTypeControl: false,
      scaleControl: true,
      logoControl: true,
      mapDataControl: true,
    };
    map.value = new window.naver.maps.Map("naverMap", mapOptions);
    loadPins();
  };

  // 필터 초기화 함수
  const resetFilters = () => {
    filters.startDate = "2025-10-09";
    filters.endDate = "2025-10-09";

    // 모든 단체 체크 해제
    Object.keys(filters.orgs).forEach((key) => {
      filters.orgs[key] = false;
    });

    // 모든 권역 체크 해제
    Object.keys(filters.regions).forEach((key) => {
      filters.regions[key] = false;
    });

    // 모든 수거량 체크 해제
    Object.keys(filters.quantity).forEach((key) => {
      filters.quantity[key] = false;
    });

    // 필터 초기화 후 핀 새로고침
    loadPins();
  };

  // filters가 변경될 때마다 핀 새로 불러오기
  watch(filters, loadPins, { deep: true });

  return {
    map,
    pins,
    markers,
    filters,
    selectedPin,
    selectedMarker,
    loadNaverMapAPI,
    initializeMap,
    resetFilters,
    renderMarkers,
    loadPins,
    closeModal,
  };
}

const getLatestDateFromReports = (reports) => {
  if (!reports || reports.length === 0) return null;

  const latest = reports
    .map((r) => new Date(r.reportDate))
    .sort((a, b) => b - a)[0];

  return latest ? latest.toISOString().split("T")[0] : null;
};

const getActivityCount = (reports) => {
  return reports ? reports.length : 0;
};

const normalizePins = (pinList) => {
  return pinList.map((pin) => {
    const latestDate = getLatestDateFromReports(pin.reports);
    const count = getActivityCount(pin.reports);

    return {
      ...pin,
      latestActivityDate: latestDate || pin.latestActivityDate || null,
      activityCount: count, // ⭐ 자동 계산!
    };
  });
};
