"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useEffect } from "react";
import {
  MAX_SHORTCUT_STATION_COUNT,
  useStationShortcutsStore,
} from "@/stores/station-shortcuts-store";

export default function StationShortcuts() {
  const shortcutStations = useStationShortcutsStore(
    (state) => state.shortcutStations,
  );
  const isHydrated = useStationShortcutsStore((state) => state.hasHydrated);
  const hydrateStationShortcuts = useStationShortcutsStore(
    (state) => state.hydrateStationShortcuts,
  );
  const hasShortcuts = shortcutStations.length > 0;

  useEffect(() => {
    // shortcut 영역이 처음 마운트될 때 localStorage에 저장된 역 목록을 Zustand store로 복원한다.
    hydrateStationShortcuts();
  }, [hydrateStationShortcuts]);

  return (
    <section
      aria-label="즐겨찾기 역"
      className="w-[110%] !pl-4 !pb-2 !pt-2 md:!pb-3 bg-blue-200"
    >
      <div className="flex min-h-12 flex-col justify-center gap-2 md:min-h-16">
        <div className="flex items-center gap-1">
          <Star
            size={14}
            aria-hidden="true"
            className="stroke-daejeon-ink/75 !-mt-0.5"
          />
          <h2 className="text-xs font-semibold !text-daejeon-ink/70">
            즐겨찾기
          </h2>
          <span className="text-[11px] font-semibold !text-daejeon-ink/25">
            {isHydrated
              ? `${shortcutStations.length}/${MAX_SHORTCUT_STATION_COUNT}`
              : ""}
          </span>
        </div>
        <div className="flex max-h-24 min-h-8 flex-wrap items-center gap-1.5 overflow-y-auto md:max-h-none md:min-h-16">
          {/* localStorage 복원 전에는 서버/클라이언트 렌더 차이를 피하기 위해 칩을 그리지 않는다. */}
          {isHydrated && hasShortcuts
            ? shortcutStations.map((station) => (
                <Link
                  key={station.id}
                  href={`/stations/${station.id}`}
                  className="shrink-0 rounded-full border !px-3 !py-1 text-xs font-semibold !text-daejeon-ink/75 active:scale-95 cursor-pointer z-50"
                >
                  {station.name}
                </Link>
              ))
            : null}
          {isHydrated && !hasShortcuts && (
            <p className="text-xs font-semibold !text-daejeon-ink/25">
              별을 눌러 즐겨찾기를 추가하세요.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
