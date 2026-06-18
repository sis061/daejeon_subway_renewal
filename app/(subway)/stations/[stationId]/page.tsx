import type { Metadata } from "next";
import { getStationById } from "@/data/stations";

type StationPageProps = {
  params: Promise<{
    stationId: string;
  }>;
};

export async function generateMetadata({
  params,
}: StationPageProps): Promise<Metadata> {
  const { stationId } = await params;
  const station = getStationById(Number(stationId));

  if (!station) {
    return {
      title: "역을 찾을 수 없습니다",
      description: "대전 도시철도 1호선 역 정보를 찾을 수 없습니다.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${station.name}역`;
  const description = `${station.name}역의 시간표 기반 다음 열차 도착 예정 정보를 확인하세요.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "ko_KR",
      siteName: "대전 지하철 NOW",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function StationPage() {
  return null;
}
