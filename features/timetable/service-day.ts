import type { Holiday } from "@/features/holiday/holiday.types";

import type { ServiceDayType } from "./timetable.types";

const AFTER_MIDNIGHT_SERVICE_BOUNDARY_HOUR = 3;

export function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}${month}${day}`;
}

export function getServiceDate(date: Date) {
  const serviceDate = new Date(date);

  // 00시 이후 막차는 시간표상 24:xx로 표현되지만 운행일은 전날에 속한다.
  // 00:00~02:59만 전날 운행일로 보고, 이후 새벽은 당일 첫차 대기 시간대로 본다.
  if (date.getHours() < AFTER_MIDNIGHT_SERVICE_BOUNDARY_HOUR) {
    serviceDate.setDate(serviceDate.getDate() - 1);
  }

  return serviceDate;
}

export function getHolidayApiParams(date: Date) {
  const serviceDate = getServiceDate(date);

  // 새벽 막차 시간대에는 전날 운행일 기준의 공휴일 정보를 조회해야 한다.
  return {
    year: serviceDate.getFullYear(),
    month: serviceDate.getMonth() + 1,
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
  const serviceDate = getServiceDate(date);

  // 평일/휴일 시간표 선택도 실제 날짜가 아니라 운행일 기준 날짜로 판정한다.
  return isWeekend(serviceDate) || isHolidayDate(serviceDate, holidays)
    ? "holiday"
    : "weekday";
}
