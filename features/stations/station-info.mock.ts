import type { RawStationInfoItem } from "./station-info.types";

export const rawStationInfoMock = [
  {
    bikeStorageYn: "Y",
    elevatorFac: "상대식, 엘리베이터 4대, 에스컬레이터 6대",
    elevatorYn: "Y",
    lactationRoomYn: "N",
    lostPropertyCenterYn: "N",
    platform: "양쪽",
    screenDoor: "완전밀폐형",
    stationAddr: "유성구 노은로 지하 161(지족동)",
    stationArea: "5,817",
    stationCode: "120",
    stationExit: "4곳, 연결통로 1곳",
    stationName: "노은역",
    stationOrigin: [
      "이 일대의 옛 지명은 넓은 들에 마을이 생겨 논골이라 부르다 노은골, 노은동으로 불려 졌으며, 노은동 남쪽 마을 앞 들 가운데에 샘이 있었는데 가뭄에도 끊이지 않고 수정처럼 맑은 물이 나와 그 주위에 형성된 마을을 수정골이라고 불려졌다.",
      "역은 유성구 지족동(법정동명)에 있으나 행정동명인 노은 2동에 위치해 있고 노은택지개발지구 내에 있어 지역을 대표하는 지역명을 역명으로 사용",
    ],
    stationPointInfo: [
      "노은역은 대전지하철 1호선 22개 역사 중 판암역으로부터 19번째인 18km 34지점에 위치하고 있다. 유성구 노은동은 6만 5천의 인구가 거주하는 아파트 단지가 밀집되어 형성된 도시로서, 새롭게 개발되고 있는 행정도시로 가는 길목에 있어 신흥 주거단지로 많은 이들이 선호하는 곳이다. 노은역 주변으로는 하루가 멀다하게 화려한 인테리어와 현대식 시설을 갖춘 상업시설들이 즐비하게 들어서고 있으며, 지역을 개발하다가 발견된 선사유적지는 대표적인 자랑거리이지만 은구비 공원, 쉼터와 각종 체육시설이 갖추어져 있는 지족산 또한 주민들의 자랑거리이다.",
    ],
    stationStruct: "지하2층",
    stationTel: "042-826-3120",
    supplyRoomYn: "N",
    toilet: "바깥",
    transferParkingYn: "Y",
    unloadDoor: "오른쪽",
    wheelchairChargingYn: "Y",
    wheelchairLiftYn: "N",
  },
] satisfies RawStationInfoItem[];
