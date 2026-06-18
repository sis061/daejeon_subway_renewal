import type { RawStationInfoItem } from "./station-info.types";

const STATION_INFO_API_URL =
  "https://apis.data.go.kr/B554695/StationInfoSVC/getStationInfo";

interface Response {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items?: {
        item: RawStationInfoItem | RawStationInfoItem[];
      };
    };
  };
}

function getServiceKey() {
  const serviceKey = process.env.API_SERVICE_KEY;

  if (!serviceKey) {
    throw new Error("서비스 키를 확인하세요.");
  }

  return serviceKey;
}

function toArray<T>(value: T | T[] | undefined): T[] {
  if (!value) return [];

  return Array.isArray(value) ? value : [value];
}

export async function fetchStationInfo(
  stationId: number,
): Promise<RawStationInfoItem[]> {
  const serviceKey = getServiceKey();
  const searchParams = new URLSearchParams({
    serviceKey,
    stationcode: String(stationId),
    _type: "json",
  });

  const response = await fetch(
    `${STATION_INFO_API_URL}?${searchParams.toString()}`,
    {
      next: {
        revalidate: 60 * 60 * 24 * 7,
        tags: [`station-info-${stationId}`],
      },
    },
  );

  if (!response.ok) {
    throw new Error(`역별 정보 조회 실패: ${response.status}`);
  }

  const data = (await response.json()) as Response;

  if (data.response.header.resultCode !== "00") {
    throw new Error(`응답 오류: ${data.response.header.resultMsg}`);
  }

  return toArray(data.response.body.items?.item);
}
