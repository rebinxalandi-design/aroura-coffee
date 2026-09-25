"use client";

import Image from "next/image";

/**
 * Real photography stages of the coffee-making journey, stacked as
 * absolutely-positioned layers inside a square frame. Each layer carries a
 * data-stage attribute so GSAP can crossfade + Ken-Burns scale/pan between
 * them across one scrubbed ScrollTrigger timeline. A warm duotone/gradient
 * overlay ties the stock photography to the site's cream/espresso palette.
 */
const STAGES = [
  {
    key: "beans",
    src: "/hero/beans.jpg",
    alt: "Whole roasted coffee beans",
  },
  {
    key: "grind",
    src: "/hero/grind.jpg",
    alt: "Freshly ground coffee in a portafilter beside whole beans",
  },
  {
    key: "espresso",
    src: "/hero/espresso.jpg",
    alt: "A shot of espresso with rich crema",
  },
  {
    key: "milk",
    src: "/hero/milk.jpg",
    alt: "Steamed milk being poured into a latte",
  },
  {
    key: "latte",
    src: "/hero/latte-final.jpg",
    alt: "A finished latte with heart latte art, resting on coffee beans",
  },
] as const;

export default function CoffeeScene({ finalState = false }: { finalState?: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] shadow-[0_40px_120px_-20px_rgba(44,25,18,0.45)]">
      {STAGES.map((stage, i) => {
        const isFinal = finalState && i === STAGES.length - 1;
        const isFirst = i === 0;
        return (
          <div
            key={stage.key}
            data-stage={i}
            className="absolute inset-0"
            style={{
              opacity: finalState ? (isFinal ? 1 : 0) : isFirst ? 1 : 0,
            }}
          >
            <div data-part="stage-photo" className="relative h-full w-full">
              <Image
                src={stage.src}
                alt={stage.alt}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 90vw, 60vw"
                className="object-cover"
              />
            </div>
            {/* warm duotone overlay so stock photography reads as one palette */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(44,25,18,0.4) 0%, rgba(44,25,18,0.06) 28%, rgba(44,25,18,0) 55%, rgba(44,25,18,0.34) 100%), radial-gradient(120% 100% at 50% 0%, rgba(185,138,79,0.14) 0%, rgba(44,25,18,0.18) 100%)",
                mixBlendMode: "multiply",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                boxShadow: "inset 0 0 80px 20px rgba(44,25,18,0.25)",
              }}
            />
          </div>
        );
      })}

      {/* steam wisps, layered above the final latte photo */}
      <div
        data-part="steam-group"
        className="pointer-events-none absolute inset-x-0 top-[8%] z-10 flex justify-center gap-6 opacity-0"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            data-part="steam-wisp"
            className="block h-24 w-3 rounded-full bg-white/70 blur-md"
            style={{ transform: `translateY(0) rotate(${(i - 1) * 6}deg)` }}
          />
        ))}
      </div>
    </div>
  );
}
