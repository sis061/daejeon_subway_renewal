/*
 * 클라이언트 사이트에서
 * 7. 현재 시각을 변환 => getMinutesFromMidnight(now) 하고 상/하행 각각에서 해당 시간보다 크거나 같은 열차를 찾음.
 */

import type { DepartureTime, NextDeparture } from "./timetable.types";

function getMinutesFromMidnight(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function formatTimeLabel(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// 특정 역에 열차가 도착하기 전까지 남은 시간 계산 함수

export function getNextDeparture(
  departures: DepartureTime[],
  now: Date,
): NextDeparture | null {
  const nowMinutes = getMinutesFromMidnight(now);
  const departure = departures.find(
    (item) => item.minutesFromMidnight >= nowMinutes,
  );

  if (!departure) {
    return null;
  }

  return {
    departure,
    remainingMinutes: departure.minutesFromMidnight - nowMinutes,
    arrivalTimeLabel: formatTimeLabel(departure.hour, departure.minute),
  };
}
