/*
 * 4. 사용자가 선택한 역의 데이터만 선별
 * 5. 평일/휴일, 상행/하행으로 데이터 분류
 * 6. 시간대 별로 묶여있는 데이터 => 열차 한 대 단위로 재정렬 (DepartureTime[]) + 자정부터의 출발시간을 분 으로 변경 (minutesFromMidnight)
 * @return StationArrivalSchedule
 */

import { getStationById } from "@/data/stations";

import type {
  DepartureTime,
  DirectionDepartureSchedule,
  StationArrivalSchedule,
  StationDepartureSchedules,
  TimetableItem,
} from "./timetable.types";

// 상/하행 빈 배열 만들기

function createEmptyDirectionSchedule(): DirectionDepartureSchedule {
  return {
    towardPanam: [],
    towardBanseok: [],
  };
}

// 평일/주말(공휴일) 빈 배열 만들기 -> 평일/상행, 평일/하행, 주말/상행, 주말/하행

function createEmptyStationSchedules(): StationDepartureSchedules {
  return {
    weekday: createEmptyDirectionSchedule(),
    holiday: createEmptyDirectionSchedule(),
  };
}

// 정규화된 서버에서 받은 값을 시간 데이터로 바꿈

function toDepartureTimes(item: TimetableItem): DepartureTime[] {
  return item.minutes.map((minute) => ({
    hour: item.hour,
    minute: minute.minute,
    note: minute.note,
    raw: minute.raw,
    minutesFromMidnight: item.hour * 60 + minute.minute,
  }));
}

// 상행, 하행 각각 도착 시간 순서대로 정렬

function sortDepartures(schedule: DirectionDepartureSchedule) {
  schedule.towardPanam.sort(
    (a, b) => a.minutesFromMidnight - b.minutesFromMidnight,
  );
  schedule.towardBanseok.sort(
    (a, b) => a.minutesFromMidnight - b.minutesFromMidnight,
  );
}

// URL 파라미터로 받은 특정 역의 시간표를 retrun. DepartureTime 타입에 맞게 클라이언트에서 쉽게 현재시각과 비교할 수 있음.

export function createStationArrivalSchedule(
  stationId: number,
  timetable: TimetableItem[],
): StationArrivalSchedule | null {
  const station = getStationById(stationId);

  if (!station) {
    return null;
  }

  const schedules = createEmptyStationSchedules();
  const stationTimetable = timetable.filter(
    (item) => item.stationId === stationId,
  );

  stationTimetable.forEach((item) => {
    schedules[item.dayType][item.direction].push(...toDepartureTimes(item));
  });

  sortDepartures(schedules.weekday);
  sortDepartures(schedules.holiday);

  return {
    stationId: station.id,
    stationName: station.name,
    schedules,
  };
}
