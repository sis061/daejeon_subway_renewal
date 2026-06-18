"use client";

import { useState } from "react";

type StationAddressCopyButtonProps = {
  address: string;
};

export default function StationAddressCopyButton({
  address,
}: StationAddressCopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1200);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={copyAddress}
      aria-label="역 주소 복사"
      className="!ml-2 text-xs font-bold !text-blue-500 active:scale-95"
    >
      <span aria-live="polite">{isCopied ? "복사됨" : "복사"}</span>
    </button>
  );
}
