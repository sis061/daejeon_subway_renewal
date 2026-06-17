// 공공API getAllTimeTable 응답 원본 타입
export type RawTimetableItem = {
  dayType: "0" | "1";
  drctType: "0" | "1";
  stNum: string;
  tmZone: string;
  tmList: string;
};

// dayType 명시적으로 변경
export type ServiceDayType = "weekday" | "holiday";

// drctType 명시적으로 변경
export type TrainDirection = "towardPanam" | "towardBanseok";

// tmList의 분 단위 항목 cf) "32(판암)"처럼 종착 메모가 붙는 값도 있음
export type TimetableMinute = {
  minute: number;
  finalDestination: string | null;
  raw: string;
};

// 앱에서 쓰는 키로 정규화
export type TimetableItem = {
  stationId: number;
  dayType: ServiceDayType;
  direction: TrainDirection;
  hour: number;
  minutes: TimetableMinute[];
};

// 클라이언트에서 현재 시각과 빠르게 비교하기 위해 도착 시간 생성용 타입
export type DepartureTime = {
  hour: number;
  minute: number;
  finalDestination: string;
  isLastTrain: boolean;
  raw: string;
  minutesFromMidnight: number; //이게 중요함 - 자정부터 도착시간까지의 시간을 분으로 계산
};

// 도착정보 패널에서 쓰는 방향별 출발 시각 묶음
export type DirectionDepartureSchedule = {
  towardPanam: DepartureTime[];
  towardBanseok: DepartureTime[];
};

// 한 역의 평일/휴일 출발 시각 묶음
export type StationDepartureSchedules = {
  weekday: DirectionDepartureSchedule;
  holiday: DirectionDepartureSchedule;
};

// 서버에서 준비해 도착정보 클라이언트 UI에 넘기는 데이터
export type StationArrivalSchedule = {
  stationId: number;
  stationName: string;
  schedules: StationDepartureSchedules;
};

// 출발 시각 목록에서 가장 가까운 다음 열차를 계산한 결과
export type NextDeparture = {
  departure: DepartureTime;
  remainingSeconds: number;
  remainingMinutes: number;
  arrivalTimeLabel: string;
};
