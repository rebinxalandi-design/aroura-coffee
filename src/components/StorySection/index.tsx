"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import StoryPanel from "./StoryPanel";
import { useLocale } from "@/lib/i18n/LocaleProvider";

// Images/alt text stay fixed (they're not language-dependent); only the
// eyebrow/title/copy come from the dictionary, keyed by array index.
const PANEL_IMAGES = [
  { src: "/hero/beans.jpg", alt: "Whole roasted coffee beans" },
  { src: "/hero/grind.jpg", alt: "Roasted beans and freshly ground coffee on a wooden board", reverse: true },
  { src: "/hero/espresso.jpg", alt: "A shot of espresso with rich crema" },
  { src: "/hero/milk.jpg", alt: "Steamed milk being poured into a latte", reverse: true },
  { src: "/hero/latte-final.jpg", alt: "A finished latte with heart latte art, resting on coffee beans" },
];

export default function StorySection() {
  const { t } = useLocale();
  const PANELS = t.story.panels.map((panel, i) => ({
    ...panel,
    image: { src: PANEL_IMAGES[i].src, alt: PANEL_IMAGES[i].alt },
    reverse: PANEL_IMAGES[i].reverse,
  }));
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 80%" },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section id="craft" className="bg-cream px-6 py-24 md:px-12 md:py-32">
      <div ref={headingRef} className="mx-auto max-w-2xl text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.28em] text-wood">
          {t.story.eyebrow}
        </p>
        <h2 className="font-display text-4xl italic leading-tight text-espresso md:text-5xl">
          {t.story.title}
        </h2>
      </div>

      <div className="mx-auto mt-16 max-w-5xl divide-y divide-espresso/8 md:mt-24">
        {PANELS.map((panel, i) => (
          <StoryPanel key={i} {...panel} />
        ))}
      </div>
    </section>
  );
}
