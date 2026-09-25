"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import StoryPanel from "./StoryPanel";

const PANELS = [
  {
    eyebrow: "01 — Quality",
    title: "It starts with the seed.",
    copy: "We work directly with smallholder farms across three continents, selecting only lots that meet our standard for sweetness, body, and clarity.",
    image: { src: "/hero/beans.jpg", alt: "Whole roasted coffee beans" },
  },
  {
    eyebrow: "02 — Roasting",
    title: "Roasted in small batches.",
    copy: "Each batch is roasted by hand to draw out its character — never rushed, never masked. Consistency comes from patience, not shortcuts.",
    image: { src: "/hero/grind.jpg", alt: "Roasted beans and freshly ground coffee on a wooden board" },
    reverse: true,
  },
  {
    eyebrow: "03 — Grinding",
    title: "Ground moments before brewing.",
    copy: "Freshness fades fast once beans are ground. We mill to order, calibrated precisely for each extraction method, cup by cup.",
    image: { src: "/hero/espresso.jpg", alt: "A shot of espresso with rich crema" },
  },
  {
    eyebrow: "04 — Brewing",
    title: "Extraction, dialed to the gram.",
    copy: "Temperature, pressure, and time are tuned daily against every new lot — because no two harvests taste quite the same.",
    image: { src: "/hero/milk.jpg", alt: "Steamed milk being poured into a latte" },
    reverse: true,
  },
  {
    eyebrow: "05 — Craftsmanship",
    title: "Finished by hand, every time.",
    copy: "The final pour is where technique becomes expression. It's the last, and most human, step in the journey from soil to cup.",
    image: { src: "/hero/latte-final.jpg", alt: "A finished latte with heart latte art, resting on coffee beans" },
  },
];

export default function StorySection() {
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
          Our Craft
        </p>
        <h2 className="font-display text-4xl italic leading-tight text-espresso md:text-5xl">
          From soil to cup, nothing is left to chance.
        </h2>
      </div>

      <div className="mx-auto mt-16 max-w-5xl divide-y divide-espresso/8 md:mt-24">
        {PANELS.map((panel) => (
          <StoryPanel key={panel.title} {...panel} />
        ))}
      </div>
    </section>
  );
}
