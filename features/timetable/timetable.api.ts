/*
 * 1. api 요청

 * 대전교통공사_열차시각표 조회 서비스
 * GET 전역시각표조회
 *
 * https://www.data.go.kr/data/15159278/openapi.do#/API%20%EB%AA%A9%EB%A1%9D/getAllTimeTable
 */

import type { RawTimetableItem } from "./timetable.types";

const TIMETABLE_API_URL =
  "https://apis.data.go.kr/B554695/TimeTableSVC/getAllTimeTable";

interface Response {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item: RawTimetableItem | RawTimetableItem[];
      };
    };
  };
}

function getServiceKey() {
  const serviceKey = process.env.API_SERVICE_KEY;

  if (!serviceKey) {
    throw new Error("서비스 키를 확인하세요.");
  }

  return serviceKey;
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];

  return Array.isArray(value) ? value : [value];
}

export async function getAllTimeTable(): Promise<RawTimetableItem[]> {
  const searchParams = new URLSearchParams({
    serviceKey: getServiceKey(),
    _type: "json",
  });

  const response = await fetch(
    `${TIMETABLE_API_URL}?${searchParams.toString()}`,
    {
      next: {
        revalidate: 60 * 60 * 24,
        tags: ["all-time-table"],
      },
    },
  );

  if (!response.ok) {
    throw new Error(`열차 시간표 요청 실패: ${response.status}`);
  }

  const data = (await response.json()) as Response;

  const { resultCode, resultMsg } = data.response.header;

  if (resultCode !== "00") {
    throw new Error(`시간표 응답 오류: ${resultMsg}`);
  }

  return toArray(data.response.body.items?.item);
}
