import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "대전 지하철 NOW!",
  description: "대전 지하철 도착 예정 정보",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
