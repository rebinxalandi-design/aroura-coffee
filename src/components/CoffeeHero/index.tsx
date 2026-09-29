"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import CoffeeScene from "./CoffeeScene";
import StageIndicator from "./StageIndicator";
import MagneticButton from "../MagneticButton";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function CoffeeHero() {
  const { t } = useLocale();
  const STAGE_LABELS = t.hero.stages;
  const sectionRef = useRef<HTMLDivElement>(null);
  const sceneWrapRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with OS-level media query, not derivable during render/SSR
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;

    const section = sectionRef.current;
    const sceneWrap = sceneWrapRef.current;
    if (!section || !sceneWrap) return;

    const q = gsap.utils.selector(section);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          // A function (re-evaluated on every ScrollTrigger refresh, e.g. a
          // phone rotating or a window resize) instead of a value baked in
          // from window.innerWidth at mount time, which would otherwise
          // stick with whatever orientation/width the page first loaded in.
          end: () => (window.innerWidth < 768 ? "+=220%" : "+=500%"),
          scrub: 1,
          pin: true,
          // The page's root wrapper is a flex column (see app/page.tsx). GSAP's
          // pinSpacing auto-detection disables spacer resizing whenever the
          // pinned element's parent is display:flex, which silently collapsed
          // the pin's scroll room to one viewport height instead of the full
          // "+=500%" — forcing it on keeps the spacer (and hero pin distance)
          // correctly sized regardless of the flex layout.
          pinSpacing: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const stage = Math.min(5, Math.floor(self.progress * 6));
            setActiveStage(stage);
          },
        },
      });

      const stageLayers = [0, 1, 2, 3, 4].map((i) => q(`[data-stage="${i}"]`));
      const stagePhotos = stageLayers.map(
        (layer) => layer[0]?.querySelectorAll('[data-part="stage-photo"]') ?? []
      );

      // idle floating/breathing on the first (beans) photo, independent of scroll
      gsap.to(stagePhotos[0], {
        scale: 1.04,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // set initial Ken-Burns starting scale on every photo layer
      stagePhotos.forEach((photo) => {
        gsap.set(photo, { scale: 1.08 });
      });

      const crossfade = (fromIndex: number, toIndex: number, at: number, duration = 0.9) => {
        return tl
          .to(stageLayers[fromIndex], { opacity: 0, duration, ease: "power1.inOut" }, at)
          .fromTo(
            stageLayers[toIndex],
            { opacity: 0 },
            { opacity: 1, duration, ease: "power1.inOut" },
            at
          )
          .fromTo(
            stagePhotos[toIndex],
            { scale: 1.16 },
            { scale: 1.04, duration: duration + 0.6, ease: "power2.out" },
            at
          );
      };

      // 1. Beans -> Grind
      crossfade(0, 1, 0.5, 0.9)
        .to(q('[data-text="0"]'), { autoAlpha: 0, y: -20, duration: 0.3 }, 0.5)
        .to(sceneWrap, { scale: 1.03, duration: 0.9, ease: "power1.inOut" }, 0.5)
        .to(q('[data-text="1"]'), { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, 0.95);

      // 2. Grind -> Espresso
      tl.to(q('[data-text="1"]'), { autoAlpha: 0, y: -20, duration: 0.3 }, 1.5);
      crossfade(1, 2, 1.6, 0.9)
        .to(sceneWrap, { scale: 1, duration: 1, ease: "power1.inOut" }, 1.6)
        .to(q('[data-text="2"]'), { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, 2.05);

      // 3. Espresso -> Milk pour
      tl.to(q('[data-text="2"]'), { autoAlpha: 0, y: -20, duration: 0.3 }, 2.6);
      crossfade(2, 3, 2.7, 0.9)
        .to(sceneWrap, { scale: 1.03, duration: 0.9, ease: "power1.inOut" }, 2.7)
        .to(q('[data-text="3"]'), { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, 3.15);

      // 4. Milk -> Latte (finished, latte art)
      tl.to(q('[data-text="3"]'), { autoAlpha: 0, y: -20, duration: 0.3 }, 3.7);
      crossfade(3, 4, 3.8, 0.9)
        .to(sceneWrap, { scale: 1, duration: 1, ease: "power1.inOut" }, 3.8)
        .to(q('[data-text="4"]'), { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out" }, 4.25);

      // 5. Steam rises, camera settles, final brand reveal
      tl.to(sceneWrap, { scale: 1.08, duration: 1.1, ease: "power2.inOut" }, 4.5)
        .to(q('[data-part="steam-group"]'), { opacity: 0.6, duration: 0.6 }, 4.6)
        .to(
          q('[data-part="steam-wisp"]'),
          { y: -34, opacity: 0.15, duration: 1.2, ease: "power1.out", stagger: 0.2 },
          4.6
        )
        .to(q('[data-text="4"]'), { autoAlpha: 0, y: -20, duration: 0.3 }, 4.7)
        .to(q('[data-part="final-reveal"]'), { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 4.85);
    }, section);

    // The pin's "+=500%" end is measured against the full document height,
    // which isn't final until every section below the hero has laid out.
    // Refresh once more after that paint so the pin distance isn't clamped short.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [reduced]);

  if (reduced) {
    return (
      <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-cream px-6 text-center">
        <div className="relative aspect-square w-[min(80vw,480px)]">
          <CoffeeScene finalState />
        </div>
        <p className="mb-3 mt-6 text-xs uppercase tracking-[0.3em] text-espresso/60">
          {t.hero.brand}
        </p>
        <h1 className="font-display text-4xl italic text-espresso md:text-6xl">
          {t.hero.finalTitle}
        </h1>
        <div className="mt-8">
          <MagneticButton>{t.hero.cta}</MagneticButton>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative z-30 h-screen w-full overflow-hidden bg-cream"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          ref={sceneWrapRef}
          className="relative aspect-square w-[min(90vw,700px)] md:w-[min(60vw,760px)]"
        >
          <CoffeeScene />
        </div>
      </div>

      {/* Stage captions */}
      <div className="pointer-events-none absolute inset-x-0 top-[14%] z-20 flex flex-col items-center px-6 text-center md:top-[16%]">
        {STAGE_LABELS.map((s, i) => (
          <div
            key={i}
            data-text={i}
            // The first caption should already be readable on load (a visitor
            // who hasn't scrolled yet should still see something on the
            // hero, not a bare photo) — GSAP's scrub timeline only needs to
            // animate it back out on scroll, not fade it in from scratch.
            // Every later stage still starts hidden, revealed by the timeline.
            className={
              i === 0
                ? "absolute translate-y-0 opacity-100"
                : "invisible absolute translate-y-6 opacity-0"
            }
          >
            {/* A dark scrim sits behind the text itself (not just a
                text-shadow) because at this fixed 14%-from-top position the
                caption doesn't reliably land over the dark photo on every
                viewport -- on a narrow/tall mobile screen the centered
                square photo is shorter than the viewport, so the caption
                lands on the plain cream page background instead, where the
                light, fixed caption color (#f3e6d8, chosen to read on the
                dark photo) has almost no contrast and was reported
                unreadable in light mode. The scrim guarantees contrast
                regardless of what's behind it. */}
            <div className="rounded-2xl bg-espresso-deep/55 px-5 py-3 backdrop-blur-sm">
              {/* These captions need to stay light in both themes -- text-cream
                  would flip to a dark color in the dark theme (where
                  --color-cream is swapped to sit behind dark-mode surfaces)
                  and vanish. */}
              <p className="font-display text-3xl italic text-[#f3e6d8] [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] md:text-5xl">
                {s.title}
              </p>
              <p className="mt-3 text-sm tracking-wide text-[#f3e6d8]/85 [text-shadow:0_1px_10px_rgba(0,0,0,0.4)] md:text-base">
                {s.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Final reveal: brand + CTA */}
      <div
        data-part="final-reveal"
        className="invisible absolute inset-0 z-20 flex translate-y-6 flex-col items-center justify-end pb-16 text-center opacity-0 md:pb-20"
      >
        {/* Same scrim-behind-text fix as the stage captions above -- this
            block is anchored to the bottom of the full-screen section, not
            the (shorter, on narrow/tall viewports) centered photo, so it
            can land on the plain page background instead of the photo. */}
        <div className="rounded-2xl bg-espresso-deep/55 px-6 py-4 backdrop-blur-sm">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#f3e6d8]/80 [text-shadow:0_1px_10px_rgba(0,0,0,0.4)]">
            {t.hero.brand}
          </p>
          <h1 className="font-display text-4xl italic text-[#f3e6d8] [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] md:text-6xl">
            {t.hero.finalTitle}
          </h1>
        </div>
        <div className="mt-8">
          <MagneticButton>{t.hero.cta}</MagneticButton>
        </div>
      </div>

      <StageIndicator activeIndex={activeStage} />
    </section>
  );
}
