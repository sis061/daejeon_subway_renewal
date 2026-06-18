import {
  Accessibility,
  ArrowUpDown,
  Baby,
  BatteryCharging,
  Bike,
  CircleParking,
  DoorOpen,
  MapPin,
  PackageSearch,
  Phone,
  ShelvingUnit,
  Toilet,
  TrainFront,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StationInfo } from "@/features/stations/station-info.types";
import {
  getBooleanInfoItemClassName,
  getStationInfoValue,
  getStationInfoValueClassName,
} from "@/lib/station-info-ui";
import StationAddressCopyButton from "./station-address-copy-button";

type StationInfoDrawerContentProps = {
  stationInfo: StationInfo[] | null;
};

type TextInfoItemProps = {
  icon: LucideIcon;
  label: string;
  value?: string | null;
};

type BooleanInfoItemProps = {
  icon: LucideIcon;
  label: string;
  isAvailable: boolean;
};

function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="!py-4">
      <h3 className="text-sm font-bold !text-daejeon-ink">{title}</h3>
      <ul className="!mt-2 grid grid-cols-2 gap-1.5">{children}</ul>
    </section>
  );
}

function TextInfoItem({ icon: Icon, label, value }: TextInfoItemProps) {
  return (
    <li className="flex items-center gap-2 rounded-lg !px-2 !py-2 text-sm font-semibold ">
      <Icon
        size={16}
        strokeWidth={2.3}
        className="shrink-0 stroke-daejeon-ink/75"
      />
      <div className="min-w-0">
        <p className="!text-daejeon-ink/75">{label}</p>
        <p className={getStationInfoValueClassName(value)}>
          {getStationInfoValue(value)}
        </p>
      </div>
    </li>
  );
}

function BooleanInfoItem({
  icon: Icon,
  label,
  isAvailable,
}: BooleanInfoItemProps) {
  const statusStyle = getBooleanInfoItemClassName(isAvailable);

  return (
    <li className={statusStyle.itemClassName}>
      <Icon size={16} strokeWidth={2.3} className={statusStyle.iconClassName} />
      <span className={statusStyle.labelClassName}>{label}</span>
    </li>
  );
}

export default function StationInfoDrawerContent({
  stationInfo,
}: StationInfoDrawerContentProps) {
  const info = stationInfo?.[0];

  if (!info) {
    return (
      <section className="flex h-full w-full items-center justify-center !px-6">
        <p className="text-sm font-semibold !text-daejeon-ink/40">
          역 상세정보를 불러오지 못했습니다.
        </p>
      </section>
    );
  }

  const lineNumber = String(info.stationId)[0];
  const phoneNumberHref = info.telephone.replaceAll("-", "");

  return (
    <section className="flex h-full w-full flex-col overflow-hidden">
      <div className="shrink-0 w-full">
        <div className="flex items-center justify-start gap-2 w-full">
          <span className="bg-daejeon-line size-5 text-sm text-center inline-block font-bold rounded-full !text-daejeon-bg !mb-1">
            {lineNumber}
          </span>
          <h2 className="text-2xl font-semibold !text-daejeon-ink">
            {info.stationName}역
          </h2>
          <p className="text-sm font-semibold !text-daejeon-ink/50 self-end">
            상세 정보
          </p>
        </div>
      </div>

      <div className="!mt-2 min-h-0 flex-1 divide-y divide-daejeon-line-soft overflow-y-auto !pb-6">
        <InfoSection title="시설정보">
          <TextInfoItem
            icon={TrainFront}
            label="승강장"
            value={info.platform}
          />
          <TextInfoItem
            icon={DoorOpen}
            label="내리는 문"
            value={info.unloadDoor}
          />
          <TextInfoItem
            icon={Toilet}
            label="화장실 개찰구"
            value={info.toiletLocation}
          />
        </InfoSection>

        <InfoSection title="편의시설">
          <BooleanInfoItem
            icon={Bike}
            label="자전거 보관소"
            isAvailable={info.facilities.hasBikeStorage}
          />
          <BooleanInfoItem
            icon={Baby}
            label="수유실"
            isAvailable={info.facilities.hasLactationRoom}
          />
          <BooleanInfoItem
            icon={PackageSearch}
            label="유실물 센터"
            isAvailable={info.facilities.hasLostPropertyCenter}
          />
          <BooleanInfoItem
            icon={CircleParking}
            label="환승 주차장"
            isAvailable={info.facilities.hasTransferParking}
          />
        </InfoSection>

        <InfoSection title="교통 약자 정보">
          <BooleanInfoItem
            icon={ArrowUpDown}
            label="엘리베이터"
            isAvailable={info.facilities.hasElevator}
          />
          <BooleanInfoItem
            icon={BatteryCharging}
            label="휠체어 충전기"
            isAvailable={info.facilities.hasWheelchairCharging}
          />
          <BooleanInfoItem
            icon={Accessibility}
            label="휠체어 리프트"
            isAvailable={info.facilities.hasWheelchairLift}
          />
          <BooleanInfoItem
            icon={ShelvingUnit}
            label="물품 보관실"
            isAvailable={info.facilities.hasSupplyRoom}
          />
        </InfoSection>
        <section className="!py-4">
          <h3 className="text-sm font-bold !text-daejeon-ink">
            주소 / 전화번호
          </h3>
          <div className="!mt-2 flex flex-col gap-2">
            <div className="flex items-start gap-2 rounded-lg !px-2 !py-2">
              <MapPin
                size={16}
                strokeWidth={2.3}
                className="!mt-0.5 shrink-0 stroke-daejeon-ink/75"
              />
              <p className="min-w-0 text-sm font-semibold leading-5 !text-daejeon-ink/75">
                {info.address}
                <StationAddressCopyButton address={info.address} />
              </p>
            </div>
            <a
              href={`tel:${phoneNumberHref}`}
              className="flex w-fit items-center gap-2 rounded-lg !px-2 !py-2 text-sm font-semibold !text-blue-500"
            >
              <Phone
                size={16}
                strokeWidth={2.3}
                className="shrink-0 stroke-daejeon-ink/75"
              />
              <span className="!text-blue-500">{info.telephone}</span>
            </a>
          </div>
        </section>
      </div>
    </section>
  );
}
