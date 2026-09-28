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
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/20 bg-cream-soft/50 shadow-[0_8px_30px_-12px_rgba(44,25,18,0.25)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-500 hover:bg-cream-soft/70"
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-beige">
        <div ref={imgRef} className="absolute inset-0">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-espresso-deep/35 via-transparent to-espresso-deep/10" />
        </div>
        {tag && (
          <span className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/25 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-espresso shadow-sm backdrop-blur-md">
            {tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h4 className="font-display text-xl italic text-espresso">
              {name}
            </h4>
            <span className="whitespace-nowrap text-sm font-medium text-wood">
              {formatToman(item.priceToman, locale)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-espresso/60">
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={onOrder}
          data-cursor-hover
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-full border border-espresso/25 px-5 text-xs uppercase tracking-[0.15em] text-espresso transition-colors duration-300 hover:border-espresso hover:bg-espresso hover:text-cream"
        >
          {t.menu.order}
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-espresso transition-transform duration-500 group-hover:scale-x-100" />
    </div>
  );
}
