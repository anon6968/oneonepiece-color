import type { MetadataRoute } from "next";
import { getIndex } from "@/lib/data";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/chapters`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
  ];
  const chapters = getIndex().map((c) => ({
    url: `${SITE.url}/read/${c.chapter}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...base, ...chapters];
}
