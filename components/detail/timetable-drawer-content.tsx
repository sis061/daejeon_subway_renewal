"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import type {
  DepartureTime,
  NextDeparture,
  ServiceDayType,
  StationArrivalSchedule,
} from "@/features/timetable/timetable.types";
import { NextDeparturesByDirection } from "@/features/timetable/get-next-departures-by-direction";

type TimetableDrawerContentProps = {
  schedule: StationArrivalSchedule;
  serviceDayType: ServiceDayType;
  nextDepartures: NextDeparturesByDirection;
};

type HourlyDepartures = {
  hour: number;
  departures: DepartureTime[];
};

const DAY_TYPE_LABEL: Record<ServiceDayType, string> = {
  weekday: "평일",
  holiday: "주말/공휴일",
};

function formatDepartureTime(departure: DepartureTime) {
  return `${String(departure.hour).padStart(2, "0")}:${String(
    departure.minute,
  ).padStart(2, "0")}`;
}

function groupByHour(departures: DepartureTime[]): HourlyDepartures[] {
  const groups = new Map<number, DepartureTime[]>();

  departures.forEach((departure) => {
    const currentDepartures = groups.get(departure.hour) ?? [];
    currentDepartures.push(departure);
    groups.set(departure.hour, currentDepartures);
  });

  return Array.from(groups.entries()).map(([hour, departures]) => ({
    hour,
    departures,
  }));
}

function DirectionTimetable({
  departures,
  next,
}: {
  departures: DepartureTime[];
  next?: NextDeparture | null;
}) {
  const hourlyDepartures = useMemo(() => groupByHour(departures), [departures]);

  return (
    <section className="min-w-0 flex-1">
      <div className="flex flex-col gap-3">
        {hourlyDepartures.map(({ hour, departures }) => (
          <div key={hour} className="grid grid-cols-[2.25rem_1fr] gap-2">
            <span className="text-xs font-semibold !text-daejeon-ink/40">
              {String(hour).padStart(2, "0")}시
            </span>
            <div className="flex flex-wrap gap-1.5">
              {departures.map((departure) => (
                <span
                  key={`${departure.hour}-${departure.minute}-${departure.raw}`}
                  className={clsx(
                    next?.arrivalTimeLabel == formatDepartureTime(departure) &&
                      "!text-blue-500",
                    "!px-2 !py-1 text-xs font-semibold ",
                  )}
                  style={{
                    color: "#4f535090",
                  }}
                  title={`${departure.finalDestination}행`}
                >
                  {formatDepartureTime(departure)}
                  {departure.isLastTrain && (
                    <span className="!text-blue-500/75 !pl-1">
                      {departure.finalDestination}행 (막)
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function TimetableDrawerContent({
  schedule,
  serviceDayType,
  nextDepartures,
}: TimetableDrawerContentProps) {
  const [dayType, setDayType] = useState<ServiceDayType>(serviceDayType);
  const selectedSchedule = schedule.schedules[dayType];
  const lineNumber = String(schedule.stationId)[0];

  return (
    <section className="flex h-full w-full flex-col overflow-hidden">
      <div className="shrink-0 w-full">
        <div className="flex items-center justify-start gap-2 w-full">
          <span className="bg-daejeon-line size-5 text-sm text-center inline-block font-bold rounded-full !text-daejeon-bg !mb-1">
            {lineNumber}
          </span>
          <h2 className="text-2xl font-semibold !text-daejeon-ink">
            {schedule.stationName}역
          </h2>
          <p className="text-sm font-semibold !text-daejeon-ink/50 self-end">
            전체 시간표
          </p>
        </div>

        <ButtonGroup className="!mt-4 self-start">
          {(["weekday", "holiday"] as const).map((type) => (
            <Button
              key={type}
              type="button"
              onClick={() => setDayType(type)}
              aria-pressed={dayType === type}
              variant={dayType === type ? "default" : "ghost"}
              className={clsx(
                "shadow-xs !px-4 !py-2 text-xs font-semibold cursor-pointer",
                dayType === type
                  ? "!bg-daejeon-line !text-daejeon-bg"
                  : "!text-daejeon-ink/60",
              )}
            >
              {DAY_TYPE_LABEL[type]}
            </Button>
          ))}
        </ButtonGroup>
      </div>

      <div className="!mt-6 flex shrink-0 items-center gap-4">
        <h3 className="min-w-0 flex-1 text-sm font-bold !text-daejeon-ink/70">
          판암 방면
        </h3>
        <div className="w-px self-stretch bg-daejeon-line-soft" />
        <h3 className="min-w-0 flex-1 text-sm font-bold !text-daejeon-ink/70">
          반석 방면
        </h3>
      </div>

      <div className="!mt-3 min-h-0 flex-1 overflow-y-auto !pb-6">
        <div className="flex items-start gap-4">
          <DirectionTimetable
            departures={selectedSchedule.towardPanam}
            next={nextDepartures.towardPanam}
          />
          <div className="min-h-full w-px self-stretch bg-daejeon-line-soft" />
          <DirectionTimetable
            departures={selectedSchedule.towardBanseok}
            next={nextDepartures.towardBanseok}
          />
        </div>
      </div>
    </section>
  );
}
