import { getStationInfo } from "@/features/stations/get-station-info";
import { NextResponse } from "next/server";

type StationInfoRouteContext = {
  params: Promise<{
    stationId: string;
  }>;
};

export async function GET(_request: Request, context: StationInfoRouteContext) {
  const { stationId } = await context.params;
  const stationIdNumber = Number(stationId);

  // 클라이언트가 직접 공공데이터 API를 호출하지 않도록 서버 라우트에서 역 상세정보를 중계한다.
  if (!Number.isInteger(stationIdNumber)) {
    return NextResponse.json(
      { message: "유효하지 않은 역 번호입니다." },
      { status: 400 },
    );
  }

  const stationInfo = await getStationInfo(stationIdNumber);

  if (!stationInfo || stationInfo.length === 0) {
    return NextResponse.json(
      { message: "역 상세정보를 찾을 수 없습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json(stationInfo);
}
