"use client";

import { useEffect, useState } from "react";
import type { StationInfo } from "@/features/stations/station-info.types";
import StationInfoDrawerContent from "./station-info-drawer-content";
import type { StationCoordinate } from "./station-info-map";

type StationInfoDrawerPanelProps = {
  stationId: number;
  enabled: boolean;
};

type FetchState = {
  stationInfo: StationInfo[] | null;
  stationCoordinate: StationCoordinate | null;
  isLoading: boolean;
  errorMessage: string | null;
};

const initialFetchState: FetchState = {
  stationInfo: null,
  stationCoordinate: null,
  isLoading: false,
  errorMessage: null,
};

export default function StationInfoDrawerPanel({
  stationId,
  enabled,
}: StationInfoDrawerPanelProps) {
  const [fetchState, setFetchState] = useState<FetchState>(initialFetchState);

  useEffect(() => {
    // 상세정보 drawer가 실제로 열렸을 때만 호출해서 초기 역 선택 렌더링을 가볍게 유지한다.
    if (!enabled) return;

    const controller = new AbortController();

    async function fetchStationInfo() {
      // 역 상세정보와 지도 좌표를 한 번의 로딩 상태로 묶어 drawer 안에서 로딩 문구가 두 번 깜빡이지 않게 한다.
      setFetchState((currentState) => ({
        ...currentState,
        isLoading: true,
        errorMessage: null,
      }));

      try {
        // 브라우저에서는 내부 API 라우트만 호출하고, 공공데이터 API 키는 서버에만 둔다.
        const response = await fetch(`/api/stations/${stationId}/info`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("역 상세정보를 불러오지 못했습니다.");
        }

        const stationInfo = (await response.json()) as StationInfo[];
        const address = stationInfo[0]?.address;
        // 상세정보 API에서 받은 주소를 기준으로 좌표를 이어서 조회한다.
        // 지도 컴포넌트가 직접 fetch하지 않게 해 상세정보 drawer의 로딩 흐름을 한 곳에서 관리한다.
        const stationCoordinate = address
          ? await fetchStationCoordinate(address, controller.signal)
          : null;

        setFetchState({
          stationInfo,
          stationCoordinate,
          isLoading: false,
          errorMessage: null,
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setFetchState({
          stationInfo: null,
          stationCoordinate: null,
          isLoading: false,
          errorMessage:
            error instanceof Error
              ? error.message
              : "역 상세정보를 불러오지 못했습니다.",
        });
      }
    }

    fetchStationInfo();

    return () => {
      // drawer가 닫히거나 역이 바뀌면 이전 요청 결과가 뒤늦게 반영되지 않도록 취소한다.
      controller.abort();
    };
  }, [enabled, stationId]);

  if (fetchState.isLoading) {
    return (
      <section
        role="status"
        aria-live="polite"
        className="flex h-full w-full items-center justify-center !px-6"
      >
        <p className="text-sm font-semibold !text-daejeon-ink/40">
          역 상세정보를 불러오는 중입니다.
        </p>
      </section>
    );
  }

  if (fetchState.errorMessage) {
    return (
      <section
        role="alert"
        className="flex h-full w-full items-center justify-center !px-6"
      >
        <p className="text-sm font-semibold !text-daejeon-ink/40">
          {fetchState.errorMessage}
        </p>
      </section>
    );
  }

  return (
    <StationInfoDrawerContent
      stationInfo={fetchState.stationInfo}
      stationCoordinate={fetchState.stationCoordinate}
    />
  );
}

async function fetchStationCoordinate(address: string, signal: AbortSignal) {
  const searchParams = new URLSearchParams({ address });
  // 클라이언트는 내부 API 라우트만 호출하고, 카카오 REST API 키는 서버 라우트에만 둔다.
  const response = await fetch(
    `/api/kakao/address-to-coordinate?${searchParams.toString()}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("역 위치 정보를 불러오지 못했습니다.");
  }

  return response.json() as Promise<StationCoordinate>;
}
