import ArrivalInfo from "@/components/detail/arrival-info";
import { getMonthlyHolidays } from "@/features/holiday/holiday.api";
import { getStationArrivalSchedule } from "@/features/timetable/get-station-arrival-schedule";
import { getHolidayApiParams } from "@/features/timetable/service-day";

type StationPageProps = {
  params: Promise<{
    stationId: string;
  }>;
};

export default async function StationPage({ params }: StationPageProps) {
  const { stationId } = await params;
  const now = new Date();
  const holidayApiParams = getHolidayApiParams(now);
  const schedule = await getStationArrivalSchedule(Number(stationId));

  const holidays = await getMonthlyHolidays(holidayApiParams).catch(() => []);

  return <ArrivalInfo schedule={schedule} holidays={holidays} />;
}
