import { NextResponse } from "next/server";

const KAKAO_ADDRESS_SEARCH_API_URL =
  "https://dapi.kakao.com/v2/local/search/address.json";

type KakaoAddressSearchResponse = {
  documents: {
    x: string;
    y: string;
    address_name: string;
  }[];
};

function getKakaoRestApiKey() {
  const restApiKey = process.env.KAKAO_REST_API_KEY;

  if (!restApiKey) {
    throw new Error("카카오 REST API 키를 확인하세요.");
  }

  return restApiKey;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address")?.trim();

  if (!address) {
    return NextResponse.json(
      { message: "주소를 입력하세요." },
      { status: 400 },
    );
  }

  const kakaoSearchParams = new URLSearchParams({
    query: address,
    // 지하철역 주소는 하나의 대표 좌표만 필요하므로 첫 번째 결과만 요청한다.
    size: "1",
  });

  // 카카오 Local 주소 검색 API는 JavaScript 키가 아니라 REST API 키를 Authorization 헤더로 받는다. 헷갈리지 말것!
  const response = await fetch(
    `${KAKAO_ADDRESS_SEARCH_API_URL}?${kakaoSearchParams.toString()}`,
    {
      headers: {
        Authorization: `KakaoAK ${getKakaoRestApiKey()}`,
      },
      next: {
        // 역 주소와 좌표는 거의 바뀌지 않으므로 넉넉하게 캐싱해 외부 API 호출을 줄인다.
        revalidate: 60 * 60 * 24 * 30,
      },
    },
  );

  if (!response.ok) {
    return NextResponse.json(
      { message: "주소 좌표 조회에 실패했습니다." },
      { status: response.status },
    );
  }

  const data = (await response.json()) as KakaoAddressSearchResponse;
  const firstDocument = data.documents[0];

  if (!firstDocument) {
    return NextResponse.json(
      { message: "주소에 해당하는 좌표를 찾지 못했습니다." },
      { status: 404 },
    );
  }

  return NextResponse.json({
    addressName: firstDocument.address_name,
    lng: Number(firstDocument.x),
    lat: Number(firstDocument.y),
  });
}
