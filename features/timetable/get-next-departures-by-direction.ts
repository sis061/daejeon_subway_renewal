import { getNextDeparture } from "./get-next-departure";
import type {
  NextDeparture,
  ServiceDayType,
  StationArrivalSchedule,
} from "./timetable.types";

export type NextDeparturesByDirection = {
  towardPanam: NextDeparture | null;
  towardBanseok: NextDeparture | null;
};

export function getNextDeparturesByDirection(
  schedule: StationArrivalSchedule,
  dayType: ServiceDayType,
  now: Date,
): NextDeparturesByDirection {
  const directionSchedule = schedule.schedules[dayType];

  return {
    towardPanam: getNextDeparture(directionSchedule.towardPanam, now),
    towardBanseok: getNextDeparture(directionSchedule.towardBanseok, now),
  };
}
