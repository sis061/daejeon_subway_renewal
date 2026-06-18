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
    <main className="wrapper h-[100svh] overflow-hidden md:h-[100dvh]">
      <div className="inner h-[100svh] overflow-hidden !mx-auto !w-full !p-2 !pt-3 md:h-[100dvh] md:!pt-4">
        {children}
        <div className="flex w-full h-[calc(100svh-4.25rem)] min-h-0 items-center justify-between md:h-[calc(100dvh-4.5rem)]">
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
