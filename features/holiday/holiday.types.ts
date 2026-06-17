// getRestDeInfo JSON 응답의 공휴일 item 원본 타입
export type RawHolidayItem = {
  dateKind: string;
  dateName: string;
  isHoliday: "Y" | "N";
  locdate: number | string;
  seq: number | string;
};

// getRestDeInfo JSON 응답의 최상위 원본 타입입니다.
export type RawHolidayResponse = {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item?: RawHolidayItem | RawHolidayItem[];
      };
      numOfRows: number | string;
      pageNo: number | string;
      totalCount: number | string;
    };
  };
};

// 앱 내부에서 쓰는 공휴일 타입입니다.
export type Holiday = {
  dateKey: string;
  name: string;
  isHoliday: boolean;
};
