/*
 * 공공API 한국천문연구원_특일 정보
 * GET 공휴일 정보 조회
 *
 * https://www.data.go.kr/data/15012690/openapi.do
 */

import { normalizeHolidayResponse } from "./normalize-holiday";
import type { Holiday, RawHolidayResponse } from "./holiday.types";

const HOLIDAY_API_URL =
  "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo";

type GetMonthlyHolidaysParams = {
  year: number;
  month: number;
};

function getServiceKey() {
  const serviceKey = process.env.API_SERVICE_KEY;

  if (!serviceKey) {
    throw new Error("API_SERVICE_KEY 를 확인하세요.");
  }

  return serviceKey;
}

export async function getMonthlyHolidays({
  year,
  month,
}: GetMonthlyHolidaysParams): Promise<Holiday[]> {
  const searchParams = new URLSearchParams({
    ServiceKey: getServiceKey(),
    solYear: String(year),
    solMonth: String(month).padStart(2, "0"),
    _type: "json",
    numOfRows: "31",
  });

  const response = await fetch(
    `${HOLIDAY_API_URL}?${searchParams.toString()}`,
    {
      next: {
        revalidate: 60 * 60 * 12,
        tags: [`holidays-${year}-${String(month).padStart(2, "0")}`],
      },
    },
  );

  if (!response.ok) {
    throw new Error(`공휴일 정보 요청 실패: ${response.status}`);
  }

  const data = (await response.json()) as RawHolidayResponse;

  return normalizeHolidayResponse(data);
}
