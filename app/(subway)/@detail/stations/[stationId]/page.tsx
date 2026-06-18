import ArrivalInfo from "@/components/detail/arrival-info";
import { getMonthlyHolidays } from "@/features/holiday/holiday.api";
import { getStationArrivalSchedule } from "@/features/timetable/get-station-arrival-schedule";
import { getHolidayApiParams } from "@/features/timetable/service-day";
import { notFound } from "next/navigation";

type StationPageProps = {
  params: Promise<{
    stationId: string;
  }>;
};

export default async function StationPage({ params }: StationPageProps) {
  const { stationId } = await params;
  const stationIdNumber = Number(stationId);

  if (!Number.isInteger(stationIdNumber)) {
    notFound();
  }

  const now = new Date();
  const holidayApiParams = getHolidayApiParams(now);

  // 첫 화면 응답 속도를 위해 바로 필요한 도착 정보와 공휴일 정보만 병렬로 가져온다.
  // 역 상세정보는 사용자가 drawer를 열 때 별도 API 라우트에서 지연 호출한다.
  const [schedule, holidays] = await Promise.all([
    getStationArrivalSchedule(stationIdNumber),
    getMonthlyHolidays(holidayApiParams).catch(() => []),
  ]);

  if (!schedule) {
    notFound();
  }

  return <ArrivalInfo schedule={schedule} holidays={holidays} />;
}
