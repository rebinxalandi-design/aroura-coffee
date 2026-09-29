"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { formatToman } from "@/lib/currency";
import type { MenuItem } from "@/lib/types";

export default function MenuCard({
  item,
  onOrder,
}: {
  item: MenuItem;
  onOrder: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const { locale, t } = useLocale();

  const onEnter = () => {
    gsap.to(imgRef.current, { scale: 1.08, duration: 0.7, ease: "power3.out" });
  };
  const onLeave = () => {
    gsap.to(imgRef.current, { scale: 1, duration: 0.7, ease: "power3.out" });
  };

  const name = item.name[locale];
  const description = item.description[locale];
  const tag = item.tag[locale];

  return (
    <div
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-cursor-hover
      className={`group relative flex flex-row overflow-hidden rounded-2xl border border-white/20 bg-cream-soft/50 shadow-[0_8px_30px_-12px_rgba(44,25,18,0.25)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-500 hover:bg-cream-soft/70 sm:flex-col ${
        item.available ? "" : "opacity-70"
      }`}
    >
      {/* Side-by-side on mobile (photo + text share one row) instead of
          stacking photo-above-text like every other card -- a long list of
          identical full-width-photo-then-text blocks reads as monotonous
          on a narrow screen where each one already fills most of the
          viewport. Reverts to the original stacked layout from sm: up,
          where cards sit in a multi-column grid and have room for it. */}
      <div className="relative aspect-square w-28 shrink-0 overflow-hidden bg-beige sm:aspect-[5/4] sm:w-full">
        <div ref={imgRef} className="absolute inset-0">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(max-width: 640px) 112px, (max-width: 1200px) 45vw, 30vw"
            className={`object-cover ${item.available ? "" : "grayscale"}`}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso-deep/35 via-transparent to-espresso-deep/10 sm:block" />
        </div>
        {tag && item.available && (
          <span className="absolute left-2 top-2 hidden rounded-full border border-white/30 bg-white/25 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-espresso shadow-sm backdrop-blur-md sm:left-4 sm:top-4 sm:inline">
            {tag}
          </span>
        )}
        {!item.available && (
          <span className="absolute left-2 top-2 rounded-full border border-white/30 bg-espresso-deep/70 px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-[#f3e6d8] shadow-sm backdrop-blur-md sm:left-4 sm:top-4 sm:px-3 sm:py-1 sm:text-[10px] sm:tracking-[0.15em]">
            {t.menu.soldOut}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
        <div>
          <div className="flex items-baseline justify-between gap-3 sm:gap-4">
            <h4 className="font-display text-base italic text-espresso sm:text-xl">
              {name}
            </h4>
            <span className="whitespace-nowrap text-xs font-medium text-wood sm:text-sm">
              {formatToman(item.priceToman, locale)}
            </span>
          </div>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-espresso/60 sm:mt-2 sm:line-clamp-none sm:text-sm">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={onOrder}
          disabled={!item.available}
          data-cursor-hover
          className="mt-3 inline-flex h-11 min-h-11 items-center justify-center self-start rounded-full border border-espresso/25 px-4 text-[11px] uppercase tracking-[0.12em] text-espresso transition-colors duration-300 hover:border-espresso hover:bg-espresso hover:text-cream disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-espresso/25 disabled:hover:bg-transparent disabled:hover:text-espresso sm:mt-6 sm:self-auto sm:px-5 sm:text-xs sm:tracking-[0.15em]"
        >
          {item.available ? t.menu.order : t.menu.soldOut}
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 hidden h-px origin-left scale-x-0 bg-espresso transition-transform duration-500 group-hover:scale-x-100 sm:block" />
    </div>
  );
}
