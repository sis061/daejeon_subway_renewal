import React from "react";
import AppFooter from "@/components/layout/app-footer";

export default function SubwayLayout({
  children,
  shortcuts,
  detail,
  rail,
}: Readonly<{
  children: React.ReactNode;
  shortcuts: React.ReactNode;
  detail: React.ReactNode;
  rail: React.ReactNode;
}>) {
  return (
    <main className="wrapper">
      <div className="inner min-h-[calc(100dvh)] h-screen !mx-auto !w-full !p-2 !pt-4">
        {children}
        <div className="flex w-full h-[calc(100dvh-4.5rem)] min-h-0 items-center justify-between">
          <section className="flex w-[65%] h-full min-w-0 flex-col">
            <div className="shrink-0">{shortcuts}</div>
            <div className="min-h-0 flex-1">{detail}</div>
          </section>
          <aside className="w-[35%] h-full min-w-0 min-h-0">{rail}</aside>
        </div>
        <AppFooter />
      </div>
    </main>
  );
}
