"use client";

import MagneticButton from "./MagneticButton";
import { LogoMark } from "./Logo";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer
      id="visit"
      className="border-t border-gold/25 bg-espresso-deep px-5 py-14 text-[#f3e6d8] md:px-12 md:py-28"
    >
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end md:gap-10">
          <div>
            <div className="mb-3 flex items-center gap-3 md:mb-4">
              <span className="h-px w-6 bg-gold/50" />
              <p className="text-xs uppercase tracking-[0.28em] text-[#f3e6d8]/50">
                {t.footer.visitUs}
              </p>
            </div>
            <h2 className="font-display max-w-md text-2xl italic leading-tight md:text-4xl">
              {t.footer.comeSit}
            </h2>
          </div>
          <MagneticButton className="!bg-[#f3e6d8] !text-espresso-deep hover:!bg-white">
            {t.footer.findLocation}
          </MagneticButton>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 border-t border-[#f3e6d8]/15 pt-8 text-sm text-[#f3e6d8]/60 sm:grid-cols-3 md:mt-16 md:gap-10 md:pt-10">
          <div>
            <p className="mb-2 text-[#f3e6d8]/90">{t.footer.hours}</p>
            <p>{t.footer.hoursWeekday}</p>
            <p>{t.footer.hoursWeekend}</p>
          </div>
          <div>
            <p className="mb-2 text-[#f3e6d8]/90">{t.footer.address}</p>
            <p>{t.footer.addressLine1}</p>
            <p>{t.footer.addressLine2}</p>
          </div>
          <div>
            <p className="mb-2 text-[#f3e6d8]/90">{t.footer.follow}</p>
            <p>Instagram</p>
            <p>Journal</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 text-xs text-[#f3e6d8]/40 sm:flex-row sm:items-center md:mt-16">
          <p>© {new Date().getFullYear()} Aroura Coffee. {t.footer.rights}</p>
          <span className="inline-flex items-center gap-2 text-[#f3e6d8]/70">
            <LogoMark className="h-5 w-5" />
            <span className="font-display italic">Aroura</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
