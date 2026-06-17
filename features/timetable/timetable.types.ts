export type RawTimetableItem = {
  dayType: "0" | "1";
  drctType: "0" | "1";
  stNum: string;
  tmZone: string;
  tmList: string;
};

export type ServiceDayType = "weekday" | "holiday";

export type TrainDirection = "towardPanam" | "towardBanseok";

export type TimetableMinute = {
  minute: number;
  note: string | null;
  raw: string;
};

export type TimetableItem = {
  stationId: number;
  dayType: ServiceDayType;
  direction: TrainDirection;
  hour: number;
  minutes: TimetableMinute[];
};
