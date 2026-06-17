import type { Holiday } from "@/features/holiday/holiday.types";

import type { ServiceDayType } from "./timetable.types";

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

export function getHolidayApiParams(date: Date) {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
}

export function isWeekend(date: Date) {
  const day = date.getDay();

  return day === 0 || day === 6;
}

export function isHolidayDate(date: Date, holidays: Holiday[]) {
  const dateKey = formatDateKey(date);

  return holidays.some(
    (holiday) => holiday.isHoliday && holiday.dateKey === dateKey,
  );
}

export function getServiceDayType(
  date: Date,
  holidays: Holiday[] = [],
): ServiceDayType {
  return isWeekend(date) || isHolidayDate(date, holidays)
    ? "holiday"
    : "weekday";
}
