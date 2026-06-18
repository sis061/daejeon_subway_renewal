export type RawStationInfoItem = {
  bikeStorageYn: "Y" | "N";
  elevatorFac: string;
  elevatorYn: "Y" | "N";
  lactationRoomYn: "Y" | "N";
  lostPropertyCenterYn: "Y" | "N";
  platform: string;
  screenDoor: string;
  stationAddr: string;
  stationArea: string;
  stationCode: string;
  stationExit: string;
  stationName: string;
  stationOrigin: string[];
  stationPointInfo: string[];
  stationStruct: string;
  stationTel: string;
  supplyRoomYn: "Y" | "N";
  toilet: string;
  transferParkingYn: "Y" | "N";
  unloadDoor: string;
  wheelchairChargingYn: "Y" | "N";
  wheelchairLiftYn: "Y" | "N";
};

export type StationFacilityFlags = {
  hasBikeStorage: boolean;
  hasElevator: boolean;
  hasLactationRoom: boolean;
  hasLostPropertyCenter: boolean;
  hasSupplyRoom: boolean;
  hasTransferParking: boolean;
  hasWheelchairCharging: boolean;
  hasWheelchairLift: boolean;
};

export type StationInfo = {
  stationId: number;
  stationName: string;
  address: string;
  areaSquareMeter?: number | null;
  exitInfo: string;
  telephone: string;
  platform: string;
  screenDoor: string;
  structure?: string;
  toiletLocation: string;
  elevatorFacility?: string;
  unloadDoor: string;
  origin?: string[];
  pointInfo?: string[];
  facilities: StationFacilityFlags;
};
