import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import LocaleProvider from "@/lib/i18n/LocaleProvider";
import ThemeProvider from "@/lib/theme/ThemeProvider";
import ToastProvider from "@/lib/toast/ToastProvider";
import LanguageModal from "@/components/LanguageModal";

export const metadata: Metadata = {
  title: "Aroura Coffee — Taste the Craft",
  description:
    "A premium specialty coffee house. Beans, roasted with intention, crafted into a cup worth savoring.",
};

// Runs before paint to avoid a flash of the wrong theme/direction. Reads the
// same localStorage keys the ThemeProvider/LocaleProvider use client-side.
const INIT_SCRIPT = `
(function () {
  try {
    var theme = localStorage.getItem("aroura_theme");
    if (theme !== "light" && theme !== "dark") {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", theme);

    var locale = localStorage.getItem("aroura_locale");
    if (locale === "fa") {
      document.documentElement.lang = "fa";
      document.documentElement.dir = "rtl";
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink" suppressHydrationWarning>
        <ThemeProvider>
          <LocaleProvider>
            <ToastProvider>
              <SmoothScrollProvider>
                <CustomCursor />
                <div className="grain-overlay" aria-hidden="true" />
                <LanguageModal />
                {children}
              </SmoothScrollProvider>
            </ToastProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
