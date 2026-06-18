/*
 * 3. 사용자가 선택한 역의 데이터만 선별
 * 4. 평일/휴일, 상행/하행으로 데이터 분류
 * 5. 시간대 별로 묶여있는 데이터 => 열차 한 대 단위로 재정렬 (DepartureTime[]) + 자정부터의 출발시간을 분 단위값으로 변경 (minutesFromMidnight)
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

// API에 행선지 메모가 있으면 그 값을 쓰고, 없으면 방향 기준 종착역을 기본값으로 사용
function getFinalDestination(
  direction: TimetableItem["direction"],
  destination: string | null,
): string {
  if (destination) {
    return destination;
  }

  if (direction === "towardBanseok") {
    return "반석";
  } else {
    return "판암";
  }
}

// 정규화된 서버 값을 클라이언트에서 바로 비교할 수 있는 열차 단위 시간 데이터로 바꿈
function toDepartureTimes(item: TimetableItem): DepartureTime[] {
  return item.minutes.map((minute) => ({
    hour: item.hour,
    minute: minute.minute,
    finalDestination: getFinalDestination(
      item.direction,
      minute.finalDestination,
    ),
    // 괄호 안 행선지가 있는 값은 API에서 막차성 단축 운행을 알려주는 데이터
    isLastTrain: Boolean(minute.finalDestination),
    raw: minute.raw,
    minutesFromMidnight: item.hour * 60 + minute.minute,
  }));
}

// API가 막차 표시를 주지 않는 방향도 있어서, 정렬된 목록의 마지막 열차를 막차로 보정
function markLastDeparture(departures: DepartureTime[]) {
  const lastDeparture = departures.at(-1);

  if (lastDeparture) {
    lastDeparture.isLastTrain = true;
  }
}

// 방향별 시간표를 자정 기준 분 단위값으로 오름차순 정렬
function sortDepartures(schedule: DirectionDepartureSchedule) {
  schedule.towardPanam.sort(
    (a, b) => a.minutesFromMidnight - b.minutesFromMidnight,
  );
  schedule.towardBanseok.sort(
    (a, b) => a.minutesFromMidnight - b.minutesFromMidnight,
  );
}

// 상행, 하행 각각 도착 시간 순서대로 정렬한 뒤 각 방향의 마지막 열차를 막차로 표시
function finalizeDepartures(schedule: DirectionDepartureSchedule) {
  sortDepartures(schedule);
  markLastDeparture(schedule.towardPanam);
  markLastDeparture(schedule.towardBanseok);
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

  finalizeDepartures(schedules.weekday);
  finalizeDepartures(schedules.holiday);

  return {
    stationId: station.id,
    stationName: station.name,
    schedules,
  };
}
