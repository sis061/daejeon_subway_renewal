import { cn } from "@/lib/utils";

export function getBooleanInfoItemClassName(isAvailable: boolean) {
  const statusClassName = isAvailable
    ? "!text-daejeon-ink/75 stroke-daejeon-ink/75"
    : "!text-daejeon-ink/20 stroke-daejeon-ink/20";

  return {
    itemClassName:
      "flex items-center gap-2 rounded-lg !px-2 !py-2 text-sm font-semibold",
    iconClassName: cn("shrink-0", statusClassName),
    labelClassName: statusClassName,
  };
}

export function getStationInfoValueClassName(value?: string | null) {
  return cn(
    "text-xs font-semibold",
    value ? "!text-daejeon-ink" : "!text-daejeon-ink/20",
  );
}

export function getStationInfoValue(value?: string | null) {
  return value && value.trim().length > 0 ? value : "정보 없음";
}
