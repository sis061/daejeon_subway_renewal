"use client";

import { useEffect, useState } from "react";

export function useCurrentTime(intervalMs = 30_000) {
  // 현재 시각은 서버와 클라이언트가 달라질 수 있으므로, 클라이언트 마운트 이후에만 확정한다.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const animationFrameId = window.requestAnimationFrame(() => {
      setNow(new Date());
    });

    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, intervalMs);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearInterval(intervalId);
    };
  }, [intervalMs]);

  const refreshNow = () => {
    setNow(new Date());
  };

  return { now, refreshNow, isReady: now !== null };
}
