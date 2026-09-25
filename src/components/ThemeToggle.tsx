"use client";

import { useTheme } from "@/lib/theme/ThemeProvider";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLocale();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      data-cursor-hover
      aria-label={t.theme.toggle}
      className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-espresso backdrop-blur-md transition-colors hover:bg-white/25 ${className}`}
    >
      {theme === "light" ? (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.4M12 19.1v2.4M4.2 4.2l1.7 1.7M18.1 18.1l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.2 19.8l1.7-1.7M18.1 5.9l1.7-1.7" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="currentColor"
        >
          <path d="M20.7 14.9a8.5 8.5 0 1 1-9.6-13 .7.7 0 0 1 .8 1 7 7 0 0 0 8.8 8.8.7.7 0 0 1 1 .8 8.5 8.5 0 0 1-1 2.4z" />
        </svg>
      )}
    </button>
  );
}
