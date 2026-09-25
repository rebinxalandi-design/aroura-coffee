"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { useMagnetic } from "@/hooks/useMagnetic";

interface MagneticButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "solid" | "outline";
}

export default function MagneticButton({
  children,
  variant = "solid",
  className = "",
  ...props
}: MagneticButtonProps) {
  const ref = useMagnetic<HTMLButtonElement>(0.3);

  const base =
    "magnetic-btn group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-medium tracking-wide transition-colors duration-500";
  const solid = "bg-espresso text-cream hover:bg-espresso-deep";
  const outline =
    "border border-espresso/40 text-espresso hover:border-espresso";

  return (
    <button
      ref={ref}
      data-cursor-hover
      className={`${base} ${variant === "solid" ? solid : outline} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2 overflow-hidden">
        <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-[150%]">
          {children}
        </span>
        <span className="absolute left-0 inline-block translate-y-[150%] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0">
          {children}
        </span>
      </span>
    </button>
  );
}
