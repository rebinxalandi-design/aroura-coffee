"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { MENU_ITEMS } from "./menuData";
import MenuCard from "./MenuCard";

export default function MenuSection() {
  const gridRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

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
          The Menu
        </p>
        <h2 className="font-display text-4xl italic leading-tight text-espresso md:text-5xl">
          Every cup, made to order.
        </h2>
      </div>

      <div
        ref={gridRef}
        className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:mt-20 lg:grid-cols-3"
      >
        {MENU_ITEMS.map((item) => (
          <div key={item.name} data-menu-card>
            <MenuCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
