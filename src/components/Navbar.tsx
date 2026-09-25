"use client";

import { useEffect, useState } from "react";
import MagneticButton from "./MagneticButton";
import ThemeToggle from "./ThemeToggle";
import LocaleSwitcher from "./LocaleSwitcher";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const LINKS = [
    { label: t.nav.menu, href: "#menu" },
    { label: t.nav.craft, href: "#craft" },
    { label: t.nav.visit, href: "#visit" },
  ];

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
      <div className="flex items-center gap-3">
        <LocaleSwitcher className="hidden md:flex" />
        <ThemeToggle />
        <MagneticButton
          className="hidden !px-6 !py-3 text-xs md:inline-flex"
          onClick={() => {
            document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {t.nav.orderNow}
        </MagneticButton>
        <button
          data-cursor-hover
          aria-label="Menu"
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => {
            document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="h-px w-6 bg-espresso" />
          <span className="h-px w-6 bg-espresso" />
        </button>
      </div>
    </header>
  );
}
