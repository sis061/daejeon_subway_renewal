/*
 * api로 받은 공휴일 정보 클라이언트 사이드에서 쓰기 위한 정규화
 */

import type {
  Holiday,
  RawHolidayItem,
  RawHolidayResponse,
} from "./holiday.types";

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

export function normalizeHolidayItem(raw: RawHolidayItem): Holiday {
  return {
    dateKey: String(raw.locdate),
    name: raw.dateName,
    isHoliday: raw.isHoliday === "Y",
  };
}

export function normalizeHolidayResponse(
  response: RawHolidayResponse,
): Holiday[] {
  const items = toArray(response.response.body.items?.item);

  return items.map(normalizeHolidayItem);
}
