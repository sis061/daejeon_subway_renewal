/*
 * 3. api에서 받은 데이터를 서버 사이드에서 쓰기 편하게 정규화
 */

import type {
  RawTimetableItem,
  ServiceDayType,
  TimetableItem,
  TimetableMinute,
  TrainDirection,
} from "./timetable.types";

export function normalizeDayType(
  dayType: RawTimetableItem["dayType"],
): ServiceDayType {
  return dayType === "0" ? "weekday" : "holiday";
}

export function normalizeDirection(
  drctType: RawTimetableItem["drctType"],
): TrainDirection {
  return drctType === "0" ? "towardPanam" : "towardBanseok";
}

export function parseTimetableMinute(rawMinute: string): TimetableMinute {
  const match = rawMinute.match(/^(\d{1,2})(?:\((.+)\))?$/);

  if (!match) {
    throw new Error(`Invalid timetable minute: ${rawMinute}`);
  }

  return {
    minute: Number(match[1]),
    finalDestination: match[2] ?? null,
    raw: rawMinute,
  };
}

export function normalizeTimetableItem(raw: RawTimetableItem): TimetableItem {
  const normalizeMinutes = raw.tmList
    .split(" ")
    .filter(Boolean)
    .map(parseTimetableMinute);

  return {
    stationId: Number(raw.stNum),
    dayType: normalizeDayType(raw.dayType),
    direction: normalizeDirection(raw.drctType),
    hour: Number(raw.tmZone),
    minutes: normalizeMinutes,
  };
}

export function normalizeTimetable(
  rawItems: RawTimetableItem[],
): TimetableItem[] {
  return rawItems.map(normalizeTimetableItem);
}
