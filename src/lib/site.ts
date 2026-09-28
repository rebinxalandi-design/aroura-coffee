const FALLBACK_SITE_URL = "http://localhost:3000";

if (
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PUBLIC_SITE_URL
) {
  // Falling back silently here would ship a live site whose canonical URL,
  // Open Graph image URLs, JSON-LD, and sitemap all point at
  // "http://localhost:3000" -- broken social previews and confused search
  // engines, with nothing in the build output calling it out. Warn loudly
  // instead so a missing env var in the hosting config gets noticed.
  console.warn(
    "[site] NEXT_PUBLIC_SITE_URL is not set in production -- falling back to " +
      FALLBACK_SITE_URL +
      ". Metadata, Open Graph tags, JSON-LD, and the sitemap will all use " +
      "this placeholder URL until it's set."
  );
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_SITE_URL;
export const SITE_NAME = "Aroura Coffee";
export const SITE_DESCRIPTION =
  "A premium specialty coffee house. Beans, roasted with intention, crafted into a cup worth savoring.";
