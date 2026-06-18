type StationInfoDrawerContentProps = {
  stationId: number;
};

export default function StationInfoDrawerContent({
  stationId,
}: StationInfoDrawerContentProps) {
  return (
    <section>
      <p className="text-sm font-semibold !text-daejeon-ink/50">상세정보</p>
      <h2 className="!mt-1 text-2xl font-bold !text-daejeon-ink">
        {stationId}번 역
      </h2>
    </section>
  );
}
