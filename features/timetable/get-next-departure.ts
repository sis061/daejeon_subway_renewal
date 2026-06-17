/*
 * 클라이언트 사이트에서
 * 7. 현재 시각을 변환 => getMinutesFromMidnight(now) 하고 상/하행 각각에서 해당 시간보다 크거나 같은 열차를 찾음.
 */

import type { DepartureTime, NextDeparture } from "./timetable.types";

function getSecondsFromMidnight(date: Date) {
  return date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();
}

function formatTimeLabel(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// 특정 역에 열차가 도착하기 전까지 남은 시간 계산 함수

export function getNextDeparture(
  departures: DepartureTime[],
  now: Date,
): NextDeparture | null {
  const nowSeconds = getSecondsFromMidnight(now);
  const firstDeparture = departures[0];
  const departure = departures.find(
    (item) => item.minutesFromMidnight * 60 >= nowSeconds,
  );

  if (!departure) {
    return null;
  }

  const remainingSeconds = departure.minutesFromMidnight * 60 - nowSeconds;

  // 첫차까지 60분을 넘게 기다려야 하는 새벽 시간대는 운행 종료로 취급.

  if (departure === firstDeparture && remainingSeconds > 60 * 60) {
    return null;
  }

  return {
    departure,
    remainingSeconds,
    remainingMinutes: Math.floor(remainingSeconds / 60),
    arrivalTimeLabel: formatTimeLabel(departure.hour, departure.minute),
  };
}
