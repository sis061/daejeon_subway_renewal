import Link from "next/link";
import { CircleAlert } from "lucide-react";

export default function NotFoundContent() {
  return (
    <div className="flex flex-col gap-2 text-left">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold !text-daejeon-ink/40">
          역을 찾을 수 없습니다
        </h1>
        <CircleAlert
          size={24}
          strokeWidth={2.5}
          color="#4f535050"
          aria-hidden="true"
          className="shrink-0 !-mt-0.5"
        />
      </div>
      <p className="text-xs leading-4 !text-daejeon-ink/20">
        주소를 다시 확인하거나 <br /> 노선도에서 역을 선택해 주세요.
      </p>
      <Link
        href="/"
        className="!mt-1 text-xs font-semibold !text-daejeon-line-muted"
      >
        노선도로 돌아가기
      </Link>
    </div>
  );
}
