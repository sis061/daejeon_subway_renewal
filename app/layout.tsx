import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "대전 지하철 NOW",
    template: "%s | 대전 지하철 NOW",
  },
  description:
    "대전 도시철도 1호선의 시간표 기반 다음 열차 도착 예정 정보를 빠르게 확인할 수 있는 웹앱입니다.",
  applicationName: "대전 지하철 NOW",
  authors: [{ name: "정성우" }],
  creator: "정성우",
  keywords: [
    "대전 지하철",
    "대전 도시철도",
    "대전 1호선",
    "열차 도착 정보",
    "열차시각표",
  ],
  openGraph: {
    title: "대전 지하철 NOW",
    description:
      "대전 도시철도 1호선의 시간표 기반 다음 열차 도착 예정 정보를 빠르게 확인하세요.",
    type: "website",
    locale: "ko_KR",
    siteName: "대전 지하철 NOW",
  },
  twitter: {
    card: "summary",
    title: "대전 지하철 NOW",
    description:
      "대전 도시철도 1호선의 시간표 기반 다음 열차 도착 예정 정보를 빠르게 확인하세요.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
    shortcut: [{ url: "/favicon.ico", type: "image/x-icon" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
