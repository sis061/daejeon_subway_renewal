"use client";

import { useEffect, useState } from "react";

export function useCurrentTime(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, intervalMs);

    return () => window.clearInterval(intervalId);
  }, [intervalMs]);

  const refreshNow = () => {
    setNow(new Date());
  };

  return { now, refreshNow };
}
