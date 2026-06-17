import type { RawStationInfoItem, StationInfo } from "./station-info.types";

function parseYn(value: "Y" | "N") {
  return value === "Y";
}

function parseStationArea(stationArea: string) {
  const normalized = Number(stationArea.replaceAll(",", ""));
  return Number.isFinite(normalized) ? normalized : null;
}

export function normalizeStationInfoItem(raw: RawStationInfoItem): StationInfo {
  return {
    stationId: Number(raw.stationCode),
    stationName: raw.stationName.replace(/역$/, ""),
    address: raw.stationAddr,
    areaSquareMeter: parseStationArea(raw.stationArea),
    exitInfo: raw.stationExit,
    telephone: raw.stationTel,
    platform: raw.platform,
    screenDoor: raw.screenDoor,
    structure: raw.stationStruct,
    toiletLocation: raw.toilet,
    elevatorFacility: raw.elevatorFac,
    unloadDoor: raw.unloadDoor,
    origin: raw.stationOrigin,
    pointInfo: raw.stationPointInfo,
    facilities: {
      hasBikeStorage: parseYn(raw.bikeStorageYn),
      hasElevator: parseYn(raw.elevatorYn),
      hasLactationRoom: parseYn(raw.lactationRoomYn),
      hasLostPropertyCenter: parseYn(raw.lostPropertyCenterYn),
      hasSupplyRoom: parseYn(raw.supplyRoomYn),
      hasTransferParking: parseYn(raw.transferParkingYn),
      hasWheelchairCharging: parseYn(raw.wheelchairChargingYn),
      hasWheelchairLift: parseYn(raw.wheelchairLiftYn),
    },
  };
}

export function normalizeStationInfo(rawItems: RawStationInfoItem[]): StationInfo[] {
  return rawItems.map(normalizeStationInfoItem);
}
