"use client";

import { RotateCcw } from "lucide-react";

type DetailErrorProps = {
  reset: () => void;
};

export default function DetailError({ reset }: DetailErrorProps) {
  return (
    <div className="flex h-full w-full items-center justify-center !px-6">
      <div className="flex flex-col gap-2 text-left">
        <div className="flex items-center gap-2">
          <p className="text-xl font-bold !text-daejeon-ink/40">
            정보를 불러오지 못했습니다!
          </p>
          {/* <CircleAlert
            size={24}
            strokeWidth={2.5}
            color="#4f535050"
            className="shrink-0 !-mt-0.5"
          /> */}
        </div>
        <p className="text-xs leading-4 !text-daejeon-ink/20">
          네트워크 상태를 확인한 뒤 <br /> 다시 시도해 주세요.
        </p>
        <button
          type="button"
          onClick={reset}
          className="!mt-1 flex items-center gap-1 text-xs font-semibold !text-daejeon-line-muted"
        >
          다시 시도
          <RotateCcw size={13} strokeWidth={2.5} className="shrink-0" />
        </button>
      </div>
    </div>
  );
}
