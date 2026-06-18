import ArrivalInfo from "@/components/detail/arrival-info";
import { getMonthlyHolidays } from "@/features/holiday/holiday.api";
import { getStationInfo } from "@/features/stations/get-station-info";
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
  const schedule = await getStationArrivalSchedule(stationIdNumber);
  const stationInfo = await getStationInfo(stationIdNumber);

  if (!schedule) {
    notFound();
  }

  const holidays = await getMonthlyHolidays(holidayApiParams).catch(() => []);

  return (
    <ArrivalInfo
      schedule={schedule}
      holidays={holidays}
      stationInfo={stationInfo}
    />
  );
}
