"use client";

import { Star } from "lucide-react";
import clsx from "clsx";
import { useStationShortcutsStore } from "@/stores/station-shortcuts-store";

type FavoriteStationButtonProps = {
  stationId: number;
  stationName: string;
};

export default function FavoriteStationButton({
  stationId,
  stationName,
}: FavoriteStationButtonProps) {
  const isShortcut = useStationShortcutsStore((state) =>
    state.isShortcutStation(stationId),
  );
  const isHydrated = useStationShortcutsStore((state) => state.hasHydrated);
  const toggleStationShortcut = useStationShortcutsStore(
    (state) => state.toggleStationShortcut,
  );

  return (
    <button
      type="button"
      aria-pressed={isShortcut}
      aria-label={`${stationName}역 즐겨찾기 ${isShortcut ? "해제" : "추가"}`}
      // localStorage 복원 전에는 현재 즐겨찾기 여부를 확정할 수 없어 잠시 비활성화한다.
      disabled={!isHydrated}
      onClick={() => toggleStationShortcut(stationId)}
      className="z-30 flex size-7  items-center justify-center  active:scale-95 disabled:opacity-30 cursor-pointer"
    >
      <Star
        size={17}
        aria-hidden="true"
        className={clsx("stroke-yellow-500", isShortcut && "fill-yellow-500")}
      />
    </button>
  );
}
