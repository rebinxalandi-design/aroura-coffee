"use client";

import { useEffect, useRef, useState } from "react";
import MagneticButton from "./MagneticButton";
import ThemeToggle from "./ThemeToggle";
import LocaleSwitcher from "./LocaleSwitcher";
import Logo from "./Logo";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const { t } = useLocale();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the drawer on route-internal anchor navigation and on resize past
  // the mobile breakpoint, so it can't be left open behind a desktop layout.
  useEffect(() => {
    if (!menuOpen) return;
    // A capture-phase listener runs before the toggle button's own onClick
    // (which stopPropagation() can't block, since that only stops
    // bubble-phase propagation to ancestors, not an earlier capture-phase
    // listener on document). Without the ref check here, clicking the
    // button to close the drawer would close it via this handler and then
    // immediately reopen it via the button's own toggle in the same click.
    const close = (e: MouseEvent) => {
      if (toggleBtnRef.current?.contains(e.target as Node)) return;
      setMenuOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    document.addEventListener("click", close, { capture: true });
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("click", close, { capture: true });
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  const LINKS = [
    { label: t.nav.menu, href: "#menu" },
    { label: t.nav.craft, href: "#craft" },
    { label: t.nav.visit, href: "#visit" },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 transition-all duration-500 md:px-12 ${
        scrolled || menuOpen
          ? "bg-cream/70 backdrop-blur-xl backdrop-saturate-150 shadow-[0_1px_0_0_rgba(74,47,34,0.08)]"
          : "bg-transparent"
      }`}
    >
      <a href="#top" data-cursor-hover>
        <Logo />
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
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
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
          ref={toggleBtnRef}
          data-cursor-hover
          aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          aria-expanded={menuOpen}
          className="relative flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
        >
          <span
            className={`h-px w-6 bg-espresso transition-transform duration-300 ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-espresso transition-transform duration-300 ${
              menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile drawer: frosted glass panel, dropping in below the header. */}
      <div
        className={`absolute inset-x-0 top-full overflow-hidden transition-[grid-template-rows] duration-300 ease-out md:hidden ${
          menuOpen ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0">
          <nav
            className="flex flex-col gap-1 border-t border-espresso/10 bg-cream/70 px-6 py-4 backdrop-blur-xl backdrop-saturate-150"
            onClick={(e) => e.stopPropagation()}
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cursor-hover
                className="py-3 text-base tracking-wide text-espresso/85 transition-colors hover:text-espresso"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 flex items-center gap-3 border-t border-espresso/10 pt-4">
              <LocaleSwitcher />
              <MagneticButton
                className="!px-5 !py-2.5 text-xs"
                onClick={() => {
                  setMenuOpen(false);
                  document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {t.nav.orderNow}
              </MagneticButton>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
