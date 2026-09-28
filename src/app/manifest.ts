import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Taste the Craft`,
    short_name: SITE_NAME,
    description:
      "A premium specialty coffee house. Beans, roasted with intention, crafted into a cup worth savoring.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f1e6",
    theme_color: "#2c1912",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
