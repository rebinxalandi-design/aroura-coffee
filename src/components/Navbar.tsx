"use client";

import { useEffect, useState } from "react";
import MagneticButton from "./MagneticButton";

const LINKS = [
  { label: "Menu", href: "#menu" },
  { label: "Our Craft", href: "#craft" },
  { label: "Visit", href: "#visit" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-500 md:px-12 ${
        scrolled
          ? "bg-cream/85 backdrop-blur-md shadow-[0_1px_0_0_rgba(74,47,34,0.08)]"
          : "bg-transparent"
      }`}
    >
      <a href="#top" data-cursor-hover className="font-display text-lg italic tracking-tight text-espresso">
        Aroura
      </a>
      <nav className="hidden items-center gap-10 md:flex">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            data-cursor-hover
            className="group relative text-sm tracking-wide text-espresso/80 transition-colors hover:text-espresso"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-espresso transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </nav>
      <MagneticButton className="hidden !px-6 !py-3 text-xs md:inline-flex">
        Order Now
      </MagneticButton>
      <button
        data-cursor-hover
        aria-label="Menu"
        className="flex flex-col gap-1.5 md:hidden"
      >
        <span className="h-px w-6 bg-espresso" />
        <span className="h-px w-6 bg-espresso" />
      </button>
    </header>
  );
}
