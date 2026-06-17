import ArrivalInfo from "@/components/detail/arrival-info";
import { getStationArrivalSchedule } from "@/features/timetable/get-station-arrival-schedule";

type StationPageProps = {
  params: Promise<{
    stationId: string;
  }>;
};

export default async function StationPage({ params }: StationPageProps) {
  const { stationId } = await params;
  const schedule = await getStationArrivalSchedule(Number(stationId));

  return <ArrivalInfo schedule={schedule} />;
}
