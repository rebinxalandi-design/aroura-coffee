"use client";

const STAGES = ["Beans", "Grind", "Espresso", "Milk", "Latte", "Serve"];

export default function StageIndicator({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 md:flex">
      {STAGES.map((stage, i) => (
        <div key={stage} className="flex items-center gap-3">
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
  );
}
