"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { LogoMark } from "@/components/Logo";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function QrPage() {
  const { t } = useLocale();
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading window.location, not derivable during SSR
    setOrigin(window.location.origin);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-16 text-center">
      <LogoMark className="h-10 w-10 text-espresso" />
      <p className="mb-3 mt-4 text-xs uppercase tracking-[0.3em] text-wood">
        {t.qrPage.eyebrow}
      </p>
      <h1 className="font-display text-3xl italic text-espresso md:text-4xl">
        {t.qrPage.title}
      </h1>
      <p className="mt-3 max-w-xs text-sm text-espresso/60">
        {t.qrPage.subtitle}
      </p>

      <div className="mt-10 rounded-[4px] border border-gold/20 bg-white p-6 shadow-2xl">
        {origin ? (
          <QRCodeSVG
            value={origin}
            size={220}
            level="M"
            marginSize={0}
            bgColor="#ffffff"
            fgColor="#2c1912"
          />
        ) : (
          <div className="h-[220px] w-[220px]" />
        )}
      </div>

      {origin && (
        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-espresso/40">
            {t.qrPage.urlLabel}
          </p>
          <p className="mt-2 font-display text-lg text-espresso" dir="ltr">
            {origin.replace(/^https?:\/\//, "")}
          </p>
        </div>
      )}
    </main>
  );
}
