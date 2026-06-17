import { rawAllTimeTableMock } from "./all-time-table.mock";
import { createStationArrivalSchedule } from "./create-station-arrival-schedule";
import { normalizeTimetable } from "./normalize-timetable";
import type { StationArrivalSchedule } from "./timetable.types";

export async function getStationArrivalSchedule(
  stationId: number,
): Promise<StationArrivalSchedule | null> {
  const timetable = normalizeTimetable(rawAllTimeTableMock);

  return createStationArrivalSchedule(stationId, timetable);
}
