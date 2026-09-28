import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Only real, distinct pages belong here — the marketing homepage's in-page
// anchors (#menu, #craft, #visit) are sections of "/", not separate routes,
// so they're intentionally left out.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/qr`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
