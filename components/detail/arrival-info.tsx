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
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleArrowRight,
  Info,
  RotateCcw,
} from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { Button } from "../ui/button";
import DrawerWrapper from "./drawer-wrapper";
import StationInfoDrawerContent from "./station-info-drawer-content";
import TimetableDrawerContent from "./timetable-drawer-content";

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
  const { now, refreshNow } = useCurrentTime();
  const [open, setOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<"information" | "timetable">(
    "timetable",
  );

  if (!schedule) {
    return (
      <div className="flex h-full w-full items-center justify-center !px-6">
        <div className="flex flex-col gap-2 text-left">
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold !text-daejeon-ink/40">
              역을 선택하세요
            </p>
            <CircleArrowRight
              size={24}
              strokeWidth={2.5}
              color="#4f535050"
              className="!text-daejeon-line shrink-0 animate-pulse !-mt-0.5"
            />
          </div>
          <p className="text-xs leading-4 !text-daejeon-ink/20">
            오른쪽 노선도에서 역을 누르면 <br /> 다음 열차 정보를 바로 확인할 수
            있습니다.
          </p>
        </div>
      </div>
    );
  }

  const serviceDayType = getServiceDayType(now, holidays);
  const nextDepartures = getNextDeparturesByDirection(
    schedule,
    serviceDayType,
    now,
  );
  const nearStations = getNearStationInfo(stations, schedule.stationId);
  const lineNumber = String(schedule.stationId)[0];

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-12 !px-2">
      <div className="w-full flex flex-col items-start gap-2 !px-4 relative">
        <div
          className={clsx(
            !nextDepartures.towardPanam && "opacity-0",
            "flex items-center gap-1 ",
          )}
        >
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
        <div
          className={clsx(
            !nextDepartures.towardPanam && "opacity-0",
            "flex items-end gap-2",
          )}
        >
          <span className="text-4xl font-bold !text-daejeon-ink">
            {formatRemainingTime(nextDepartures.towardPanam)}
          </span>
          {nextDepartures.towardPanam && (
            <span className="!text-daejeon-ink/50">
              {nextDepartures.towardPanam?.arrivalTimeLabel}{" "}
            </span>
          )}
        </div>
        <button
          onClick={refreshNow}
          className="absolute -top-2 right-0 z-20 cursor-pointer active:scale-95 ease-in-out duration-150 transition-all"
        >
          <RotateCcw
            size={20}
            color="#333"
            strokeWidth={2.5}
            className="shrink-0 drop-shadow-2xl"
          />
        </button>
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
          <span className="bg-daejeon-line size-5 text-sm inline-block font-bold rounded-full !text-daejeon-bg absolute left-1 top-2">
            {lineNumber}
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
      <div
        className={clsx(
          !nextDepartures.towardBanseok && "opacity-0",
          "w-full flex flex-col items-end gap-2 !px-4",
        )}
      >
        <div className="flex items-center gap-1">
          <span className="!text-daejeon-ink/75 font-semibold">
            {nextDepartures.towardBanseok
              ? nextDepartures.towardBanseok?.departure.finalDestination
              : "반석"}
            행
          </span>
          {nextDepartures.towardBanseok?.departure.isLastTrain && (
            <span className="!text-blue-500 text-sm">(막)</span>
          )}
        </div>
        <div className="flex items-end gap-2">
          {nextDepartures.towardBanseok && (
            <span className="!text-daejeon-ink/50">
              {nextDepartures.towardBanseok?.arrivalTimeLabel}{" "}
            </span>
          )}

          <span className="text-4xl font-bold !text-daejeon-ink">
            {formatRemainingTime(nextDepartures.towardBanseok)}
          </span>
        </div>
      </div>

      <div className="w-full min-h-8 flex items-center justify-center gap-4">
        <Button
          variant={"ghost"}
          className="shadow-xs !py-2 !px-4 w-22 !text-daejeon-ink/75 flex items-center justify-center"
          onClick={() => {
            setDrawerType("information");
            setOpen(!open);
          }}
        >
          <Info size={6} className="shrink-0 !-mt-0.5" color="#4f535085" />
          상세정보
        </Button>
        <Button
          variant={"ghost"}
          className="shadow-xs !py-2 !px-4 w-22 !text-daejeon-ink/75 flex items-center justify-center"
          onClick={() => {
            setDrawerType("timetable");
            setOpen(!open);
          }}
        >
          <CalendarDays
            size={6}
            className="shrink-0 !-mt-0.5"
            color="#4f535085"
          />
          시간표
        </Button>
      </div>
      <DrawerWrapper open={open} onOpenChange={setOpen}>
        {drawerType === "timetable" ? (
          <TimetableDrawerContent
            schedule={schedule}
            serviceDayType={serviceDayType}
          />
        ) : (
          <StationInfoDrawerContent stationId={schedule.stationId} />
        )}
      </DrawerWrapper>
    </div>
  );
}
