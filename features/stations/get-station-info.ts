import { normalizeStationInfo } from "./normalize-station-info";
import { fetchStationInfo } from "./station-info-api";
import type { StationInfo } from "./station-info.types";

export async function getStationInfo(
  stationId: number,
): Promise<StationInfo[] | null> {
  const rawStationInfoData = await fetchStationInfo(stationId);
  const stationInfo = normalizeStationInfo(rawStationInfoData);

  return stationInfo.filter((info) => info.stationId === stationId);
}
