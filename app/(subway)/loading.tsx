import { LoaderCircle } from "lucide-react";

export default function SubwayLoading() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-daejeon-bg !px-6">
      <div className="flex flex-col gap-2 text-left">
        <div className="flex items-center gap-2">
          <p className="text-xl font-bold !text-daejeon-ink/40">
            노선 정보를 준비하는 중...
          </p>
          <LoaderCircle
            size={24}
            strokeWidth={2.5}
            color="#4f535050"
            className="shrink-0 animate-spin !-mt-0.5"
          />
        </div>
        <p className="text-xs leading-4 !text-daejeon-ink/20">
          잠시만 기다려 주세요.
        </p>
      </div>
    </main>
  );
}
