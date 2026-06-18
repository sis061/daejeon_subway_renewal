/*
 * 클라이언트 사이트에서
 * 7. 현재 시각을 운행일 기준 초 단위로 변환하고 상/하행 각각에서 해당 시간보다 크거나 같은 열차를 찾음.
 *    00시 이후 막차는 API 시간표상 24:xx로 들어오므로 새벽 시간대는 24시간을 더해 비교한다.
 */

import type { DepartureTime, NextDeparture } from "./timetable.types";

const AFTER_MIDNIGHT_SERVICE_BOUNDARY_HOUR = 3;

function getServiceSecondsFromMidnight(date: Date) {
  const seconds =
    date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds();

  // 00:18 같은 막차는 시간표상 24:18로 저장되어 있으므로,
  // 00:00~02:59 현재 시각도 24:xx로 환산해서 전날 운행일의 막차와 비교한다.
  if (date.getHours() < AFTER_MIDNIGHT_SERVICE_BOUNDARY_HOUR) {
    return seconds + 24 * 3600;
  }

  return seconds;
}

function formatTimeLabel(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

// 특정 역에 열차가 도착하기 전까지 남은 시간 계산 함수
export function getNextDeparture(
  departures: DepartureTime[],
  now: Date,
): NextDeparture | null {
  const nowSeconds = getServiceSecondsFromMidnight(now);
  const firstDeparture = departures[0];
  const departure = departures.find(
    (item) => item.minutesFromMidnight * 60 >= nowSeconds,
  );

  if (!departure) {
    return null;
  }

  const remainingSeconds = departure.minutesFromMidnight * 60 - nowSeconds;

  // 첫차까지 99분을 넘게 기다려야 하는 새벽 시간대는 운행 종료로 취급.
  if (departure === firstDeparture && remainingSeconds > 99 * 60) {
    return null;
  }

  return {
    departure,
    remainingSeconds,
    remainingMinutes: Math.floor(remainingSeconds / 60),
    arrivalTimeLabel: formatTimeLabel(departure.hour, departure.minute),
  };
}
