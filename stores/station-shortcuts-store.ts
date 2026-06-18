import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { stations } from "@/data/stations";

export const STATION_SHORTCUTS_STORAGE_KEY = "daejeon-subway-shortcuts";

// 바로 이동할 역은 화면이 복잡해지지 않도록 최대 5개까지만 저장한다.
export const MAX_SHORTCUT_STATION_COUNT = 5;

export type StationShortcutsState = {
  // localStorage에는 역 번호만 저장한다. 역명 변경 등은 stations 마스터 데이터를 따라가게 둔다.
  shortcutStationIds: number[];
  // UI에서 바로 렌더링할 수 있도록 stationId 배열을 역 객체 배열로 전개한 값이다.
  shortcutStations: typeof stations;
  // localStorage 복원 전후를 구분해 서버 렌더와 클라이언트 렌더 차이를 줄인다.
  hasHydrated: boolean;
  hydrateStationShortcuts: () => void;
  isShortcutStation: (stationId: number) => boolean;
  toggleStationShortcut: (stationId: number) => void;
};

function sanitizeShortcutStationIds(stationIds: unknown) {
  if (!Array.isArray(stationIds)) {
    return [];
  }

  return stationIds
    .filter(
      (stationId): stationId is number =>
        typeof stationId === "number" &&
        stations.some((station) => station.id === stationId),
    )
    .slice(0, MAX_SHORTCUT_STATION_COUNT);
}

export const useStationShortcutsStore = create<StationShortcutsState>()(
  // persist는 Zustand 상태 중 필요한 값만 브라우저 storage에 저장하고, 다음 방문 때 다시 복원해준다.
  persist(
    (set, get) => ({
      shortcutStationIds: [],
      shortcutStations: [],
      hasHydrated: false,
      hydrateStationShortcuts: () => {
        // Next.js 서버 렌더 시점에는 localStorage가 없으므로, 클라이언트 마운트 이후 직접 복원한다.
        void Promise.resolve(useStationShortcutsStore.persist.rehydrate()).then(
          () => {
            const shortcutStationIds = sanitizeShortcutStationIds(
              get().shortcutStationIds,
            );

            // 저장된 값이 없더라도 복원 시도가 끝났다면 UI가 버튼을 사용할 수 있게 한다.
            set({
              shortcutStationIds,
              shortcutStations: getShortcutStations(shortcutStationIds),
              hasHydrated: true,
            });
          },
        );
      },
      isShortcutStation: (stationId) =>
        get().shortcutStationIds.includes(stationId),
      toggleStationShortcut: (stationId) => {
        set((state) => {
          const isShortcut = state.shortcutStationIds.includes(stationId);
          // 이미 등록된 역이면 제거하고, 아니면 최대 개수 안에서만 추가한다.
          const shortcutStationIds = isShortcut
            ? state.shortcutStationIds.filter(
                (shortcutStationId) => shortcutStationId !== stationId,
              )
            : state.shortcutStationIds.length < MAX_SHORTCUT_STATION_COUNT
              ? [...state.shortcutStationIds, stationId]
              : state.shortcutStationIds;

          return {
            shortcutStationIds,
            // 상태 변경 직후 shortcut UI가 바로 갱신되도록 역 객체 배열도 함께 갱신한다.
            shortcutStations: getShortcutStations(shortcutStationIds),
          };
        });
      },
    }),
    {
      // localStorage에 저장될 key 이름이다.
      name: STATION_SHORTCUTS_STORAGE_KEY,
      // JSON 직렬화/역직렬화를 거쳐 localStorage에 shortcut 상태를 저장한다.
      storage: createJSONStorage(() => window.localStorage),
      // 자동 복원을 끄고, 클라이언트에서 rehydrate()를 직접 호출해 hydration mismatch를 피한다.
      skipHydration: true,
      // 런타임 상태와 파생 데이터는 저장하지 않고, 오래 유지할 원천 데이터인 역 번호만 저장한다.
      partialize: (state) => ({
        shortcutStationIds: state.shortcutStationIds,
      }),
      // localStorage에서 읽은 값과 기본 store 상태를 합치면서, 현재 역 마스터 데이터 기준으로 한 번 더 정리한다.
      merge: (persistedState, currentState) => {
        const parsedState = persistedState as Partial<StationShortcutsState>;
        const shortcutStationIds = sanitizeShortcutStationIds(
          parsedState.shortcutStationIds,
        );

        return {
          ...currentState,
          shortcutStationIds,
          shortcutStations: getShortcutStations(shortcutStationIds),
          hasHydrated: true,
        };
      },
    },
  ),
);

function getShortcutStations(shortcutStationIds: number[]) {
  // 저장소에는 id만 보관하고, 화면에 필요한 역 이름/번호는 마스터 데이터에서 다시 찾는다.
  return shortcutStationIds
    .map((stationId) => stations.find((station) => station.id === stationId))
    .filter((station) => station !== undefined);
}
