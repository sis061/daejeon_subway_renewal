"use client";

import { getNextDeparturesByDirection } from "@/features/timetable/get-next-departures-by-direction";
import { getServiceDayType } from "@/features/timetable/service-day";
import type { Holiday } from "@/features/holiday/holiday.types";
import type {
  NextDeparture,
  StationArrivalSchedule,
} from "@/features/timetable/timetable.types";
import { Station, stations } from "@/data/stations";
import { useCurrentTime } from "@/hooks/use-current-time";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

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

function getNearStationInfo(stations: Station[], stationId: number) {
  const previousStation = stations.find(
    (station) => station.id === stationId - 1,
  );
  const nextStation = stations.find((station) => station.id === stationId + 1);

  return {
    previousStation: previousStation ?? null,
    nextStation: nextStation ?? null,
  };
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
  const nearStations = getNearStationInfo(stations, schedule.stationId);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12 !px-2">
      <div className="w-full flex flex-col items-start gap-2 !px-4">
        <div className="flex items-center gap-1">
          <span className="!text-daejeon-ink/75 font-semibold">
            {nextDepartures.towardPanam
              ? nextDepartures.towardPanam?.departure.finalDestination
              : "판암"}
            행
          </span>
          {nextDepartures.towardPanam?.departure.isLastTrain && (
            <span className="!text-blue-500 text-sm">(막)</span>
          )}
        </div>
        <span className="text-4xl font-bold !text-daejeon-ink">
          {formatRemainingTime(nextDepartures.towardPanam)}
        </span>
      </div>
      <div className="relative flex h-21 w-full items-center justify-center [--station-nav-width:clamp(6.75rem,34%,10rem)] drop-shadow-sm">
        <div
          className={clsx(
            !nearStations.previousStation && "hidden",
            "absolute left-2 top-0 z-10 h-7 w-[var(--station-nav-width)] rounded-4xl bg-daejeon-line !px-2 !py-1",
          )}
        >
          {nearStations.previousStation && (
            <Link
              href={`/stations/${nearStations.previousStation?.id}`}
              className="flex h-full items-center justify-start overflow-hidden"
            >
              <ChevronLeft size={16} color="#fafafa" className="shrink-0" />
              <span className="min-w-0 truncate text-left text-xs !text-daejeon-bg">
                {nearStations.previousStation?.name}
              </span>
            </Link>
          )}
        </div>
        <div className="z-20 min-w-[150px] rounded-4xl border-[3px] border-daejeon-line bg-daejeon-bg !px-2 !py-1 text-center relative">
          <span className="bg-daejeon-line size-5 text-sm inline-block font-semibold rounded-full !text-daejeon-bg absolute left-1 top-2">
            1
          </span>
          <span className="text-lg whitespace-nowrap !text-daejeon-ink font-semibold !pl-3">
            {schedule.stationName}
          </span>
        </div>

        <div
          className={clsx(
            !nearStations.nextStation && "hidden",
            "absolute bottom-0 right-2 z-10 h-7 w-[var(--station-nav-width)] rounded-4xl bg-daejeon-line !px-2 !py-1",
          )}
        >
          {nearStations.nextStation && (
            <Link
              href={`/stations/${nearStations.nextStation?.id}`}
              className="flex h-full items-center justify-end overflow-hidden"
            >
              <span className="min-w-0 truncate text-right text-xs !text-daejeon-bg">
                {nearStations.nextStation?.name}
              </span>
              <ChevronRight size={16} color="#fafafa" className="shrink-0" />
            </Link>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col items-end gap-2 !px-4">
        <div className="flex items-center gap-1">
          <span className="!text-daejeon-ink/75 font-semibold">
            {nextDepartures.towardBanseok
              ? nextDepartures.towardBanseok?.departure.finalDestination
              : "반석"}
            행
          </span>
          {nextDepartures.towardPanam?.departure.isLastTrain && (
            <span className="!text-blue-500 text-sm">(막)</span>
          )}
        </div>
        <span className="text-4xl font-bold !text-daejeon-ink">
          {formatRemainingTime(nextDepartures.towardBanseok)}
        </span>
      </div>
    </div>
  );
}
