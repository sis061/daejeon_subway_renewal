import { createStationArrivalSchedule } from "./create-station-arrival-schedule";
import { normalizeTimetable } from "./normalize-timetable";
import { getAllTimeTable } from "./timetable.api";
import type { StationArrivalSchedule } from "./timetable.types";
import { unstable_cache } from "next/cache";

// 전체 시간표는 모든 역 데이터라 정규화 비용이 반복될 수 있다.
// API fetch 캐시와 별개로 정규화된 결과도 하루 단위로 재사용한다.
const getNormalizedTimetable = unstable_cache(
  async () => {
    const rawTimeTableData = await getAllTimeTable();

    return normalizeTimetable(rawTimeTableData);
  },
  ["normalized-timetable"],
  {
    revalidate: 60 * 60 * 24,
    tags: ["normalized-timetable"],
  },
);

export async function getStationArrivalSchedule(
  stationId: number,
): Promise<StationArrivalSchedule | null> {
  const timetable = await getNormalizedTimetable();

  return createStationArrivalSchedule(stationId, timetable);
}
