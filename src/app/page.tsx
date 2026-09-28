import Navbar from "@/components/Navbar";
import CoffeeHero from "@/components/CoffeeHero";
import StorySection from "@/components/StorySection";
import MenuSection from "@/components/MenuSection";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Mirrors the real hours/address copy in Footer.tsx — do not invent details
// (ratings, review counts, phone numbers, etc.) that aren't already shown
// to visitors elsewhere on the site.
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Aroura Coffee",
  url: SITE_URL,
  image: `${SITE_URL}/hero/latte-final.jpg`,
  servesCuisine: "Coffee",
  address: {
    "@type": "PostalAddress",
    streetAddress: "14 Roastery Lane",
    addressLocality: "Portland",
    addressRegion: "OR",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
};

// GSAP/Lenis/the custom cursor are only needed on the cinematic marketing
// page, so they're scoped to this route instead of the root layout — that
// keeps them out of the JS bundle for /admin/* and /qr, which don't use them.
export default function Home() {
  return (
    <SmoothScrollProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
      />
      <CustomCursor />
      <div id="top" className="flex flex-1 flex-col">
        <Navbar />
        <CoffeeHero />
        <StorySection />
        <MenuSection />
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
}
