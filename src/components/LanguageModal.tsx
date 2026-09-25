"use client";

import { usePathname } from "next/navigation";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function LanguageModal() {
  const { showLangModal, chooseLocale, t } = useLocale();
  const pathname = usePathname();

  // The admin panel has its own locale switcher in its header; the
  // first-visit language prompt is a customer-facing marketing-site concern
  // and would otherwise block the login form with no way to reach it. The
  // /qr page is meant to be scanned and read at a glance (e.g. printed on a
  // table card) — it shouldn't stack a second language decision in front of
  // the one the visitor is about to make on the page the code points to.
  const skipModal = pathname?.startsWith("/admin") || pathname === "/qr";

  if (!showLangModal || skipModal) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-espresso-deep/70 backdrop-blur-sm px-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-modal-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/25 bg-cream/75 p-8 text-center shadow-2xl backdrop-blur-2xl backdrop-saturate-150 md:p-10">
        <p className="mb-2 text-xs uppercase tracking-[0.28em] text-wood">
          Aroura
        </p>
        <h2
          id="lang-modal-title"
          className="font-display text-2xl italic text-espresso md:text-3xl"
        >
          {t.langModal.title} / خوش آمدید
        </h2>
        <p className="mt-3 text-sm text-espresso/60">
          {t.langModal.subtitle} / زبان خود را انتخاب کنید
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => chooseLocale("en")}
            data-cursor-hover
            className="group relative overflow-hidden rounded-xl border border-espresso/15 bg-espresso px-6 py-3.5 text-sm tracking-wide text-cream transition-colors duration-300 hover:bg-espresso-deep"
          >
            {t.langModal.english}
          </button>
          <button
            type="button"
            onClick={() => chooseLocale("fa")}
            data-cursor-hover
            className="group relative overflow-hidden rounded-xl border border-espresso/15 bg-white/20 px-6 py-3.5 text-sm tracking-wide text-espresso backdrop-blur-md transition-colors duration-300 hover:bg-white/35"
            style={{ fontFamily: "var(--font-vazirmatn)" }}
          >
            {t.langModal.persian}
          </button>
        </div>
      </div>
    </div>
  );
}
