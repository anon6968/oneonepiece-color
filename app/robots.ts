import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Emit a static robots.txt at build time (required by output: "export").
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal / experimental pages that should never rank.
      disallow: ["/logo-lab", "/logo-lab/"],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
