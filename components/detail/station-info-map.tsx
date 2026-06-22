"use client";

import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

type StationInfoMapProps = {
  // 부모에서 주소를 좌표로 변환한 뒤 넘긴다. 지도 컴포넌트는 추가 API 요청 없이 렌더링만 담당한다.
  coordinate: StationCoordinate | null;
};

export type StationCoordinate = {
  lat: number;
  lng: number;
};

export default function StationInfoMap({ coordinate }: StationInfoMapProps) {
  // Kakao Map JavaScript SDK는 브라우저에서만 동작하므로 이 컴포넌트는 클라이언트 컴포넌트로 둔다.
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_KEY;

  const [loading, error] = useKakaoLoader({
    appkey: apiKey ?? "",
  });

  // 지도 SDK 키가 없으면 지도 영역만 실패 상태로 처리
  if (!apiKey) {
    return (
      <div className="!px-2 !py-1">
        <p className="text-sm font-semibold !text-daejeon-ink/40">
          카카오맵 API 키가 없습니다. 개발자에게 문의하세요.
        </p>
      </div>
    );
  }

  // 좌표 데이터는 이미 상위 패널 로딩에서 준비되지만, SDK 스크립트 로딩은 클라이언트에서 별도로 기다려야 한다.
  if (loading) {
    return (
      <div className="!px-2 !py-1 animate-pulse">
        <p className="text-sm font-semibold !text-daejeon-ink/40">
          지도를 불러오는 중...
        </p>
      </div>
    );
  }

  // 도메인 등록, JavaScript 키, SDK 로딩 실패는 여기서 잡는다.
  if (error) {
    console.error("카카오맵 SDK 로딩 실패: ", error);
    return (
      <div className="!px-2 !py-1">
        <p className="text-sm font-semibold !text-daejeon-ink/40">
          지도를 불러오지 못했습니다.
        </p>
      </div>
    );
  }

  // 주소 검색 API가 좌표를 찾지 못한 경우 지도 대신 안내 문구만 표시한다.
  if (!coordinate) {
    return (
      <div className="!px-2 !py-1">
        <p className="text-sm font-bold !text-daejeon-ink/40">
          역 위치를 찾지 못했습니다.
        </p>
      </div>
    );
  }

  return (
    <Map
      center={coordinate}
      style={{ width: "100%", height: "320px" }}
      level={4}
    >
      <MapMarker position={{ lat: coordinate?.lat, lng: coordinate?.lng }} />
    </Map>
  );
}
