import { createStationArrivalSchedule } from "./create-station-arrival-schedule";
import { normalizeTimetable } from "./normalize-timetable";
import { getAllTimeTable } from "./timetable.api";
import type { StationArrivalSchedule } from "./timetable.types";

export async function getStationArrivalSchedule(
  stationId: number,
): Promise<StationArrivalSchedule | null> {
  const rawTimeTableData = await getAllTimeTable();
  const timetable = normalizeTimetable(rawTimeTableData);

  return createStationArrivalSchedule(stationId, timetable);
}
