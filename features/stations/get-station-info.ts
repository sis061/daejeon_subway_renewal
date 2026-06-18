import { normalizeStationInfo } from "./normalize-station-info";
import { rawStationInfoMock } from "./station-info.mock";
import { StationInfo } from "./station-info.types";

export async function getStationInfo(
  stationId: number,
): Promise<StationInfo[] | null> {
  const rawStationInfoData = rawStationInfoMock;
  const stationInfo = normalizeStationInfo(rawStationInfoData);

  return stationInfo.filter((info) => info.stationId === stationId);
}
