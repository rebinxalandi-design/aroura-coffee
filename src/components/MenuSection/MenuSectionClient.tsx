"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import MenuCard from "./MenuCard";
import OrderModal from "./OrderModal";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { MenuItem } from "@/lib/types";

export default function MenuSectionClient({ items }: { items: MenuItem[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [orderingItem, setOrderingItem] = useState<MenuItem | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 30, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 82%" },
        }
      );

      const cards = gridRef.current?.querySelectorAll("[data-menu-card]");
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="menu" className="bg-cream-soft px-6 py-24 md:px-12 md:py-32">
      <div ref={headingRef} className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.28em] text-wood">
          {t.menu.eyebrow}
        </p>
        <h2 className="font-display text-4xl italic leading-tight text-espresso md:text-5xl">
          {t.menu.title}
        </h2>
      </div>

      <div
        ref={gridRef}
        className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:mt-20 lg:grid-cols-3"
      >
        {items.map((item) => (
          <div key={item.id} data-menu-card>
            <MenuCard item={item} onOrder={() => setOrderingItem(item)} />
          </div>
        ))}
      </div>

      {orderingItem && (
        <OrderModal item={orderingItem} onClose={() => setOrderingItem(null)} />
      )}
    </section>
  );
}
