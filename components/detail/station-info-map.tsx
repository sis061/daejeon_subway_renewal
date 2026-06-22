"use client";

import { useEffect, useState } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";

type StationInfoMapProps = {
  address: string;
};

type StationCoordinate = {
  lat: number;
  lng: number;
};

export default function StationInfoMap({ address }: StationInfoMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_KAKAO_KEY;
  const [coordinate, setCoordinate] = useState<StationCoordinate | null>(null);
  const [isCoordinateLoading, setIsCoordinateLoading] = useState(true);

  const [loading, error] = useKakaoLoader({
    appkey: apiKey ?? "",
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchCoordinate() {
      setIsCoordinateLoading(true);

      try {
        const searchParams = new URLSearchParams({ address });
        const response = await fetch(
          `/api/kakao/address-to-coordinate?${searchParams.toString()}`,
        );

        if (!response.ok) {
          throw new Error("주소 좌표 조회 실패");
        }

        const nextCoordinate = (await response.json()) as StationCoordinate;

        // Drawer 안에서 역이 바뀌거나 닫히는 중 늦게 도착한 응답이 상태를 덮어쓰지 않게 막는다.
        if (isMounted) {
          setCoordinate(nextCoordinate);
        }
      } catch (error) {
        console.error(error);

        if (isMounted) {
          setCoordinate(null);
        }
      } finally {
        if (isMounted) {
          setIsCoordinateLoading(false);
        }
      }
    }

    fetchCoordinate();

    return () => {
      isMounted = false;
    };
  }, [address]);

  // 렌더 예외 처리

  if (!apiKey) {
    return (
      <div className="!px-2 !py-1">
        <p className="text-sm font-semibold !text-daejeon-ink/40">
          카카오맵 API 키가 없습니다. 개발자에게 문의하세요.
        </p>
      </div>
    );
  }

  if (loading || isCoordinateLoading) {
    return (
      <div className="!px-2 !py-1 animate-pulse">
        <p className="text-sm font-semibold !text-daejeon-ink/40">
          지도를 불러오는 중...
        </p>
      </div>
    );
  }

  if (error) {
    console.log("error 발생: ", error);
    return (
      <div className="!px-2 !py-1">
        <p className="text-sm font-semibold !text-daejeon-ink/40">
          지도를 불러오지 못했습니다.
        </p>
      </div>
    );
  }

  if (!coordinate) {
    return (
      <div className="!px-2 !py-1">
        <p className="text-sm font-bold !text-daejeon-ink/40">
          역 위치를 찾지 못했습니다.
        </p>
      </div>
    );
  }

  //render

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
