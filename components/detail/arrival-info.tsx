"use client";

import { getNextDeparturesByDirection } from "@/features/timetable/get-next-departures-by-direction";
import { getServiceDayType } from "@/features/timetable/service-day";
import type { Holiday } from "@/features/holiday/holiday.types";
import type {
  NextDeparture,
  StationArrivalSchedule,
} from "@/features/timetable/timetable.types";
import { useCurrentTime } from "@/hooks/use-current-time";

type ArrivalInfoProps = {
  schedule: StationArrivalSchedule | null;
  holidays?: Holiday[];
};

function formatRemainingTime(nextDeparture: NextDeparture | null) {
  if (!nextDeparture) {
    return "운행 종료";
  }

  if (nextDeparture.remainingSeconds < 60) {
    return "곧 도착";
  }

  return `${nextDeparture.remainingMinutes}분`;
}

export default function ArrivalInfo({
  schedule,
  holidays = [],
}: ArrivalInfoProps) {
  const now = useCurrentTime();

  if (!schedule) {
    return <div>역을 선택해 주세요.</div>;
  }

  const serviceDayType = getServiceDayType(now, holidays);
  const nextDepartures = getNextDeparturesByDirection(
    schedule,
    serviceDayType,
    now,
  );

  console.log(schedule);

  return (
    <div>
      <h1>{schedule.stationName}</h1>
      <div>
        <span>판암행</span>
        <strong>{formatRemainingTime(nextDepartures.towardPanam)}</strong>
      </div>
      <div>
        <span>반석행</span>
        <strong>{formatRemainingTime(nextDepartures.towardBanseok)}</strong>
      </div>
    </div>
  );
}
