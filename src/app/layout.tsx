import type { Metadata, Viewport } from "next";
// Self-hosted via @fontsource (files ship in node_modules, served locally)
// instead of next/font/google, which fetches from fonts.gstatic.com at
// build/dev time -- that host is unreliable from this network and was
// causing "next dev" to fail with 500s on connection timeouts.
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/playfair-display/500-italic.css";
import "@fontsource/playfair-display/600-italic.css";
import "@fontsource/playfair-display/700-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/vazirmatn/arabic-400.css";
import "@fontsource/vazirmatn/arabic-500.css";
import "@fontsource/vazirmatn/arabic-600.css";
import "@fontsource/vazirmatn/arabic-700.css";
import "./globals.css";
import LocaleProvider from "@/lib/i18n/LocaleProvider";
import ThemeProvider from "@/lib/theme/ThemeProvider";
import ToastProvider from "@/lib/toast/ToastProvider";
import LanguageModal from "@/components/LanguageModal";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const SITE_NAME = "Aroura Coffee";
const SITE_DESCRIPTION =
  "A premium specialty coffee house. Beans, roasted with intention, crafted into a cup worth savoring.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Taste the Craft`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Taste the Craft`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/hero/latte-final.jpg",
        width: 1200,
        height: 1500,
        alt: "A finished latte with heart latte art, resting on coffee beans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Taste the Craft`,
    description: SITE_DESCRIPTION,
    images: ["/hero/latte-final.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f1e6" },
    { media: "(prefers-color-scheme: dark)", color: "#2c1912" },
  ],
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
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-ink" suppressHydrationWarning>
        <ThemeProvider>
          <LocaleProvider>
            <ToastProvider>
              <div className="grain-overlay" aria-hidden="true" />
              <LanguageModal />
              {children}
            </ToastProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
