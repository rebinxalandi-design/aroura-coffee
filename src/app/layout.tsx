import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Aroura Coffee — Taste the Craft",
  description:
    "A premium specialty coffee house. Beans, roasted with intention, crafted into a cup worth savoring.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <SmoothScrollProvider>
          <CustomCursor />
          <div className="grain-overlay" aria-hidden="true" />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
