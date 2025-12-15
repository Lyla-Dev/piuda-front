import { ref, reactive, watch } from "vue";
import redPinImg from "@/assets/redpin.png";
import bluePinImg from "@/assets/bluepin.png";
import whitePinImg from "@/assets/whitepin.png";
import { corpList } from "@/assets/corpList";
import { fetchPins } from "./MapApi";

/* ============================================================
   유틸 함수
============================================================ */

const makeSlug = (name) =>
  name
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9가-힣]/g, "")
    .toLowerCase();

const getLatestDateFromReports = (reports) => {
  if (!reports || reports.length === 0) return null;
  const latest = reports
    .map((r) => new Date(r.reportDate))
    .sort((a, b) => b - a)[0];
  return latest ? latest.toISOString().split("T")[0] : null;
};

const getActivityCount = (reports) => (reports ? reports.length : 0);

const normalizePins = (pinList) => {
  return pinList.map((pin) => ({
    ...pin,
    latestActivityDate: getLatestDateFromReports(pin.reports),
    activityCount: getActivityCount(pin.reports),
  }));
};

/* ============================================================
   필터 적용 로직
============================================================ */

function applyFiltersToPins(pins, filters) {
  return pins.filter((pin) => {
    const reports = pin.reports || [];

    /* ---- 날짜 필터 ---- */
    let passDate = true;
    if (filters.startDate || filters.endDate) {
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate) : null;

      passDate = reports.some((r) => {
        const d = new Date(r.reportDate);
        if (start && d < start) return false;
        if (end && d > end) return false;
        return true;
      });
    }
    if (!passDate) return false;

    /* ---- 단체명 필터 ---- */
    const selectedOrgs = Object.keys(filters.orgs).filter(
      (k) => filters.orgs[k]
    );
    if (selectedOrgs.length > 0) {
      const passOrg = reports.some((r) =>
        selectedOrgs.includes(makeSlug(r.reportName))
      );
      if (!passOrg) return false;
    }

    /* ---- 수거량 필터 ---- */
    const selectedQ = Object.keys(filters.quantity).filter(
      (k) => filters.quantity[k]
    );
    if (selectedQ.length > 0) {
      const kg = pin.totalTrashKg || 0;
      const passQuantity = selectedQ.some((range) => {
        if (range === "low") return kg >= 0 && kg <= 10;
        if (range === "mid") return kg > 10 && kg <= 50;
        if (range === "high") return kg > 50 && kg <= 100;
        if (range === "vhigh") return kg > 100;
      });

      if (!passQuantity) return false;
    }

    return true;
  });
}

/* ============================================================
   useMapLogic 훅
============================================================ */

export function useMapLogic() {
  /* ---- 상태 ---- */
  const map = ref(null);
  const pins = ref([]);
  const markers = ref([]);
  const selectedPin = ref(null);
  const selectedMarker = ref(null);
  const rawPins = ref([]);

  const filters = reactive({
    startDate: "",
    endDate: "",
    orgs: Object.fromEntries(corpList.map((c) => [makeSlug(c.name), false])),
    quantity: {
      low: false,
      mid: false,
      high: false,
      vhigh: false,
    },
  });

  /* ---- 네이버 지도 API 로딩 ---- */
  const clientId = process.env.VUE_APP_NAVER_MAP_CLIENT_ID;
  const loadNaverMapAPI = () => {
    return new Promise((resolve, reject) => {
      if (window.naver && window.naver.maps) return resolve();

      const script = document.createElement("script");
      script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  /* ---- 마커 크기 조정 ---- */
  const resizeMarker = (marker, isSelected) => {
    const icon = marker.getIcon();
    if (!icon) return;

    const size = isSelected ? 48 : 32;
    icon.size = new window.naver.maps.Size(size, size);
    icon.scaledSize = new window.naver.maps.Size(size, size);
    icon.anchor = new window.naver.maps.Point(size / 2, size);
    marker.setIcon(icon);
  };

  /* ---- 마커 클릭 ---- */
  const onMarkerClick = (pin, marker) => {
    if (selectedMarker.value) resizeMarker(selectedMarker.value, false);
    resizeMarker(marker, true);
    selectedPin.value = pin;
    selectedMarker.value = marker;
  };

  /* ---- 모달 닫기 ---- */
  const closeModal = () => {
    if (selectedMarker.value) resizeMarker(selectedMarker.value, false);
    selectedPin.value = null;
    selectedMarker.value = null;
  };

  /* ---- 마커 렌더링 ---- */
  const renderMarkers = () => {
    markers.value.forEach((m) => m.setMap(null));
    markers.value = [];
    if (!map.value) return;

    pins.value.forEach((pin) => {
      if (!pin.pinX || !pin.pinY) return;

      let icon = null;
      const color = pin.pinColor?.toLowerCase();
      if (color === "red") icon = { url: redPinImg };
      else if (color === "blue") icon = { url: bluePinImg };
      else if (color === "white") icon = { url: whitePinImg };

      if (icon) {
        icon.size = icon.scaledSize = new window.naver.maps.Size(32, 32);
        icon.origin = new window.naver.maps.Point(0, 0);
        icon.anchor = new window.naver.maps.Point(16, 32);
      }

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(pin.pinY, pin.pinX),
        map: map.value,
        title: pin.title || pin.pinId?.toString(),
        ...(icon ? { icon } : {}),
      });

      window.naver.maps.Event.addListener(marker, "click", () =>
        onMarkerClick(pin, marker)
      );

      markers.value.push(marker);
    });
  };

  /* ---- 핀 로딩 ---- */
  const loadPins = async () => {
    try {
      rawPins.value = normalizePins(await fetchPins());
      applyFilters();
    } catch (e) {
      console.error("핀 데이터 불러오기 실패:", e);
    }
  };

  /* ---- 필터 적용 ---- */
  const applyFilters = () => {
    pins.value = applyFiltersToPins(rawPins.value, filters);
    renderMarkers();
  };

  /* ---- 지도 초기화 ---- */
  const initializeMap = () => {
    if (!window.naver || !window.naver.maps) {
      console.error("네이버 지도 API가 로드되지 않음");
      return;
    }

    map.value = new window.naver.maps.Map("naverMap", {
      center: new window.naver.maps.LatLng(36.5, 127.5),
      zoom: 7,
      mapTypeControl: false,
    });

    loadPins();
  };

  /* ---- 필터 초기화 ---- */
  const resetFilters = () => {
    filters.startDate = "";
    filters.endDate = "";

    Object.keys(filters.orgs).forEach((k) => (filters.orgs[k] = false));
    Object.keys(filters.quantity).forEach((k) => (filters.quantity[k] = false));

    pins.value = [...rawPins.value];
    renderMarkers();
  };

  /* ---- 필터 변경 감지 ---- */
  watch(filters, applyFilters, { deep: true });

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
    loadPins,
    closeModal,
  };
}
