export type Station = {
  id: number;
  name: string;
  displayName: string;
  order: number;
  isTerminal: boolean;
};

export const stations = [
  { id: 101, name: "판암", displayName: "판암", order: 1, isTerminal: true },
  { id: 102, name: "신흥", displayName: "신흥", order: 2, isTerminal: false },
  { id: 103, name: "대동", displayName: "대동", order: 3, isTerminal: false },
  { id: 104, name: "대전", displayName: "대전", order: 4, isTerminal: false },
  {
    id: 105,
    name: "중앙로",
    displayName: "중앙로",
    order: 5,
    isTerminal: false,
  },
  {
    id: 106,
    name: "중구청",
    displayName: "중구청",
    order: 6,
    isTerminal: false,
  },
  {
    id: 107,
    name: "서대전네거리",
    displayName: "서대전 네거리",
    order: 7,
    isTerminal: false,
  },
  { id: 108, name: "오룡", displayName: "오룡", order: 8, isTerminal: false },
  { id: 109, name: "용문", displayName: "용문", order: 9, isTerminal: false },
  { id: 110, name: "탄방", displayName: "탄방", order: 10, isTerminal: false },
  { id: 111, name: "시청", displayName: "시청", order: 11, isTerminal: false },
  {
    id: 112,
    name: "정부청사",
    displayName: "정부청사",
    order: 12,
    isTerminal: false,
  },
  { id: 113, name: "갈마", displayName: "갈마", order: 13, isTerminal: false },
  { id: 114, name: "월평", displayName: "월평", order: 14, isTerminal: false },
  { id: 115, name: "갑천", displayName: "갑천", order: 15, isTerminal: false },
  {
    id: 116,
    name: "유성온천",
    displayName: "유성온천",
    order: 16,
    isTerminal: false,
  },
  { id: 117, name: "구암", displayName: "구암", order: 17, isTerminal: false },
  {
    id: 118,
    name: "현충원",
    displayName: "현충원",
    order: 18,
    isTerminal: false,
  },
  {
    id: 119,
    name: "월드컵경기장",
    displayName: "월드컵 경기장",
    order: 19,
    isTerminal: false,
  },
  { id: 120, name: "노은", displayName: "노은", order: 20, isTerminal: false },
  { id: 121, name: "지족", displayName: "지족", order: 21, isTerminal: false },
  { id: 122, name: "반석", displayName: "반석", order: 22, isTerminal: true },
] satisfies Station[];

export function getStationById(stationId: number) {
  return stations.find((station) => station.id === stationId);
}

export function getStationByOrder(order: number) {
  return stations.find((station) => station.order === order);
}
