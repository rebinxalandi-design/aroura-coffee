"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

interface StoryPanelProps {
  eyebrow: string;
  title: string;
  copy: string;
  reverse?: boolean;
  image: { src: string; alt: string };
}

export default function StoryPanel({
  eyebrow,
  title,
  copy,
  reverse = false,
  image,
}: StoryPanelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      // Mask and text reveal together off the same trigger point so a fast
      // scroll (wheel flick, trackpad swipe) can never land mid-transition
      // with the text visible but the image still hidden behind its mask.
      const revealTrigger = {
        trigger: root,
        start: "top 85%",
        toggleActions: "play none none reverse",
      };

      gsap.fromTo(
        maskRef.current,
        { scaleY: 1 },
        {
          scaleY: 0,
          duration: 0.8,
          ease: "power3.inOut",
          transformOrigin: "top",
          scrollTrigger: revealTrigger,
        }
      );

      // Mobile panels are short and stacked, so this parallax scrubs faster
      // relative to a quick swipe than it does on a tall desktop viewport --
      // easing it back on narrow screens keeps the motion smooth instead of
      // jittery, without removing the effect entirely.
      const isMobile = window.innerWidth < 768;

      gsap.to(imageRef.current, {
        yPercent: isMobile ? -4 : -10,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.fromTo(
        textRef.current,
        { y: 32, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: revealTrigger,
        }
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="grid items-center gap-5 py-6 md:grid-cols-2 md:gap-16 md:py-16"
    >
      <div className={`relative ${reverse ? "md:order-2" : ""}`}>
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2px] bg-beige md:aspect-[4/5]">
          <div ref={imageRef} className="absolute inset-0 scale-110">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 90vw, 45vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-espresso/10" />
          </div>
          <div
            ref={maskRef}
            className="absolute inset-0 origin-top bg-cream"
            style={{ transform: "scaleY(1)" }}
          />
        </div>
      </div>
      <div ref={textRef} className={reverse ? "md:order-1" : ""}>
        <p className="mb-2 text-xs uppercase tracking-[0.28em] text-wood md:mb-4">
          {eyebrow}
        </p>
        <h3 className="font-display text-xl italic leading-[1.15] text-espresso md:text-4xl">
          {title}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-espresso/70 md:mt-5 md:text-[15px]">
          {copy}
        </p>
      </div>
    </div>
  );
}
