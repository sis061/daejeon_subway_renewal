"use client";

import { getNextDeparture } from "@/features/timetable/get-next-departure";
import type { StationArrivalSchedule } from "@/features/timetable/timetable.types";

type ArrivalInfoProps = {
  schedule: StationArrivalSchedule | null;
};

export default function ArrivalInfo({ schedule }: ArrivalInfoProps) {
  const now = new Date();
  const nextDepTowardBanseok = getNextDeparture(
    schedule!.schedules.weekday.towardBanseok,
    now,
  );

  console.log(nextDepTowardBanseok);

  if (!schedule) {
    return <div>역을 선택해 주세요.</div>;
  }

  return <div>{schedule.stationName}</div>;
}
