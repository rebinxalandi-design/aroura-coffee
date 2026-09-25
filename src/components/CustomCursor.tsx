"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const ringPos = { x: 0, y: 0 };
    let mouseX = 0;
    let mouseY = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    gsap.ticker.add(() => {
      ringPos.x += (mouseX - ringPos.x) * 0.18;
      ringPos.y += (mouseY - ringPos.y) * 0.18;
      gsap.set(ring, { x: ringPos.x, y: ringPos.y });
    });

    const onEnterInteractive = () => {
      gsap.to(ring, { width: 64, height: 64, borderColor: "var(--color-gold)", duration: 0.3 });
    };
    const onLeaveInteractive = () => {
      gsap.to(ring, { width: 40, height: 40, borderColor: "var(--color-espresso)", duration: 0.3 });
    };

    window.addEventListener("mousemove", move);

    const interactiveEls = document.querySelectorAll(
      "a, button, [data-cursor-hover]"
    );
    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", onEnterInteractive);
      el.addEventListener("mouseleave", onLeaveInteractive);
    });

    return () => {
      window.removeEventListener("mousemove", move);
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterInteractive);
        el.removeEventListener("mouseleave", onLeaveInteractive);
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
