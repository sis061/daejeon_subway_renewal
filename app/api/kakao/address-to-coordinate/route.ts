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

  // 역 상세정보의 주소 문자열만 받아 좌표로 바꾼다. 클라이언트에는 REST API 키를 노출하지 않는다.
  if (!address) {
    return NextResponse.json(
      { message: "주소를 입력하세요." },
      { status: 400 },
    );
  }

  const kakaoSearchParams = new URLSearchParams({
    query: address,
    size: "1",
  });

  const response = await fetch(
    `${KAKAO_ADDRESS_SEARCH_API_URL}?${kakaoSearchParams.toString()}`,
    {
      headers: {
        Authorization: `KakaoAK ${getKakaoRestApiKey()}`,
      },
      next: {
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
