"use client";

import { useEffect, useState } from "react";

// 첫 페이지 진입 때는 서버 HTML과 클라이언트 첫 렌더를 맞추기 위해 now를 null로 둔다.
// 다만 SPA 라우팅으로 역을 이동할 때마다 null부터 다시 시작하면 도착정보가 잠깐 "운행 종료"로 보인다.
// 그래서 클라이언트에서 한 번 계산된 현재 시각은 모듈 스코프에 보관해 다음 마운트의 초기값으로 재사용한다.
let currentTimeSnapshot: Date | null = null;

function getNextCurrentTime() {
  const nextNow = new Date();
  currentTimeSnapshot = nextNow;

  return nextNow;
}

export function useCurrentTime(intervalMs = 30_000) {
  // 첫 진입은 null이지만, 이후 역 이동에서는 마지막 현재시각을 초기값으로 써서 깜빡임을 줄인다.
  const [now, setNow] = useState<Date | null>(() => currentTimeSnapshot);

  useEffect(() => {
    // requestAnimationFrame으로 첫 갱신을 브라우저 렌더 이후로 미뤄 hydration mismatch를 피한다.
    const animationFrameId = window.requestAnimationFrame(() => {
      setNow(getNextCurrentTime());
    });

    // 남은 도착 시간은 API를 다시 호출하지 않고, 현재 시각만 주기적으로 갱신해서 다시 계산한다.
    const intervalId = window.setInterval(() => {
      setNow(getNextCurrentTime());
    }, intervalMs);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearInterval(intervalId);
    };
  }, [intervalMs]);

  const refreshNow = () => {
    // 사용자가 누르는 새로고침도 동일한 snapshot을 갱신해 다음 역 이동 시 재사용되게 한다.
    setNow(getNextCurrentTime());
  };

  return { now, refreshNow, isReady: now !== null };
}
