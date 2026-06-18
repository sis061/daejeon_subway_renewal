"use client";

import { useEffect, useState } from "react";
import type { StationInfo } from "@/features/stations/station-info.types";
import StationInfoDrawerContent from "./station-info-drawer-content";

type StationInfoDrawerPanelProps = {
  stationId: number;
  enabled: boolean;
};

type FetchState = {
  stationInfo: StationInfo[] | null;
  isLoading: boolean;
  errorMessage: string | null;
};

const initialFetchState: FetchState = {
  stationInfo: null,
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

        setFetchState({
          stationInfo,
          isLoading: false,
          errorMessage: null,
        });
      } catch (error) {
        if (controller.signal.aborted) return;

        setFetchState({
          stationInfo: null,
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

  return <StationInfoDrawerContent stationInfo={fetchState.stationInfo} />;
}
