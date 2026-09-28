"use client";

import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function StageIndicator({ activeIndex }: { activeIndex: number }) {
  const { t } = useLocale();
  const STAGES = t.hero.stageIndicator;

  return (
    <>
      {/* Desktop: full labeled progress trail. */}
      <div className="pointer-events-none fixed bottom-8 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 md:flex">
        {STAGES.map((stage, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-2">
              <span
                className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                  i === activeIndex
                    ? "scale-[2.2] bg-gold"
                    : i < activeIndex
                      ? "bg-espresso/60"
                      : "bg-espresso/20"
                }`}
              />
              <span
                className={`text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 ${
                  i === activeIndex ? "text-espresso" : "text-espresso/35"
                }`}
              >
                {stage}
              </span>
            </div>
            {i < STAGES.length - 1 && (
              <span className="mb-4 h-px w-6 bg-espresso/15" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile: dots only, no labels (too cramped at this width) -- still
          gives some sense of progress through the scroll-pinned hero. */}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 md:hidden">
        {STAGES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === activeIndex
                ? "w-4 bg-gold"
                : i < activeIndex
                  ? "w-1.5 bg-espresso/60"
                  : "w-1.5 bg-espresso/20"
            }`}
          />
        ))}
      </div>
    </>
  );
}
