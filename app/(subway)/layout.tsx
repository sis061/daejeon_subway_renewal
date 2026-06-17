import React from "react";

export default function SubwayLayout({
  children,
  detail,
  rail,
}: Readonly<{
  children: React.ReactNode;
  detail: React.ReactNode;
  rail: React.ReactNode;
}>) {
  return (
    <main className="wrapper">
      <div className="inner min-h-[calc(100dvh)] h-screen !mx-auto !w-full !p-2 border">
        {children}
        <div className="flex w-full min-h-full h-full items-center justify-between">
          <section className="border w-[65%] h-full min-w-0">{detail}</section>
          <aside className="w-[35%] h-full min-w-0 min-h-0">{rail}</aside>
        </div>
      </div>
    </main>
  );
}
