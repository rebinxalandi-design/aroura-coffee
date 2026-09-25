"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import type { MenuItem } from "./menuData";

export default function MenuCard({ item }: { item: MenuItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    gsap.to(imgRef.current, { scale: 1.08, duration: 0.7, ease: "power3.out" });
  };
  const onLeave = () => {
    gsap.to(imgRef.current, { scale: 1, duration: 0.7, ease: "power3.out" });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-cursor-hover
      className="group relative flex flex-col overflow-hidden rounded-[3px] border border-espresso/8 bg-cream-soft/60 transition-colors duration-500 hover:bg-cream-soft"
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
        <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[10px] uppercase tracking-[0.15em] text-espresso/70 shadow-sm backdrop-blur-sm">
          {item.tag}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h4 className="font-display text-xl italic text-espresso">
              {item.name}
            </h4>
            <span className="whitespace-nowrap text-sm font-medium text-wood">
              {item.price}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-espresso/60">
            {item.description}
          </p>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-espresso transition-transform duration-500 group-hover:scale-x-100" />
    </div>
  );
}
