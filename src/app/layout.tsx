import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Vazirmatn } from "next/font/google";
import "./globals.css";
import LocaleProvider from "@/lib/i18n/LocaleProvider";
import ThemeProvider from "@/lib/theme/ThemeProvider";
import ToastProvider from "@/lib/toast/ToastProvider";
import LanguageModal from "@/components/LanguageModal";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

// Vazirmatn covers both roles (display + body) for Persian: Latin serif
// italics have no Arabic/Persian glyphs, so fa content needs its own
// typeface family rather than falling through to the Latin fonts above.
const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-vazirmatn",
  display: "swap",
});

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
      className={`h-full antialiased ${playfairDisplay.variable} ${inter.variable} ${vazirmatn.variable}`}
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
