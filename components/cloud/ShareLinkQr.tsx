"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface ShareLinkQrProps {
  url: string;
}

export function ShareLinkQr({ url }: ShareLinkQrProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, {
      width: 96,
      margin: 1,
      color: { dark: "#312e81", light: "#ffffff" },
    }).then((result) => {
      if (!cancelled) setDataUrl(result);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (!dataUrl) {
    return (
      <div className="h-24 w-24 flex-shrink-0 animate-pulse rounded-lg bg-slate-100" />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUrl}
      alt="QR code linking to shared export"
      className="h-24 w-24 flex-shrink-0 rounded-lg border border-slate-200"
    />
  );
}
