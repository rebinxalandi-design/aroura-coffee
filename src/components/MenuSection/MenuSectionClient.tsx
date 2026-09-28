"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import MenuCard from "./MenuCard";
import OrderModal from "./OrderModal";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import type { MenuCategory, MenuItem } from "@/lib/types";

type FilterValue = MenuCategory | "all";

export default function MenuSectionClient({ items }: { items: MenuItem[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [orderingItem, setOrderingItem] = useState<MenuItem | null>(null);
  const [filter, setFilter] = useState<FilterValue>("all");
  const { t } = useLocale();

  const availableCategories = useMemo(
    () => Array.from(new Set(items.map((i) => i.category))),
    [items]
  );

  const filters: { value: FilterValue; label: string }[] = [
    { value: "all", label: t.menu.filterAll },
    ...(
      [
        ["coffee", t.menu.filterCoffee],
        ["espresso", t.menu.filterEspresso],
        ["cake", t.menu.filterCake],
        ["pastry", t.menu.filterPastry],
        ["juice", t.menu.filterJuice],
      ] as [MenuCategory, string][]
    )
      .filter(([value]) => availableCategories.includes(value))
      .map(([value, label]) => ({ value, label })),
  ];

  const filteredItems =
    filter === "all" ? items : items.filter((i) => i.category === filter);

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

      {filters.length > 2 && (
        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              data-cursor-hover
              className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.15em] transition-colors duration-300 ${
                filter === f.value
                  ? "border-espresso bg-espresso text-cream"
                  : "border-espresso/20 text-espresso/70 hover:border-espresso/50 hover:text-espresso"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      <div
        ref={gridRef}
        className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:mt-20 lg:grid-cols-3"
      >
        {filteredItems.map((item) => (
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
