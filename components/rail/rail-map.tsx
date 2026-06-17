"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stations } from "@/data/stations";
import clsx from "clsx";
import { useEffect, useRef } from "react";

function getSelectedStationId(pathname: string) {
  return pathname.match(/\/stations\/(\d+)/)?.[1] ?? null;
}

export default function RailMap() {
  const pathname = usePathname();
  const selectedStationId = getSelectedStationId(pathname);
  const selectedStationRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    selectedStationRef.current?.scrollIntoView({
      block: "center",
      behavior: "smooth",
    });
  }, [selectedStationId]);

  return (
    <div className=" w-full h-full flex flex-col items-center overflow-y-auto !p-2 relative">
      <div className="grid min-h-full w-full [grid-template-rows:repeat(22,minmax(4.75rem,1fr))]">
        {stations.map((station, index) => {
          const isSelected = String(station.id) === selectedStationId;
          const isLast = index === stations.length - 1;

          return (
            <Link
              href={`/stations/${station.id}`}
              key={station.id}
              ref={isSelected ? selectedStationRef : null}
              className="relative flex items-center justify-end w-full !pr-2 group "
            >
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="absolute pointer-events-none right-4 top-1/2 h-full w-1 -translate-x-1/2 bg-daejeon-line-muted"
                />
              )}
              <span
                className={clsx(
                  isSelected && "!bg-green-600 ",
                  "relative z-10 block size-6 rounded-full border-[3px] border-daejeon-line bg-daejeon-bg group-active:scale-95 ease-in-out duration-150 transition-all ",
                )}
              />
              <span
                className={clsx(
                  "absolute top-3 right-8 z-50 text-sm font-semibold  whitespace-nowrap",
                  isSelected ? "!text-daejeon-ink/85" : "!text-daejeon-ink/75",
                )}
              >
                {station.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
