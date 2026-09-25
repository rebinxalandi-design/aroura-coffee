"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function LocaleSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "en" ? "fa" : "en")}
      data-cursor-hover
      className={`flex h-9 items-center justify-center rounded-full border border-white/25 bg-white/10 px-3.5 text-xs uppercase tracking-[0.15em] text-espresso backdrop-blur-md transition-colors hover:bg-white/25 ${className}`}
    >
      {locale === "en" ? "FA" : "EN"}
    </button>
  );
}
