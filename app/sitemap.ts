import type { MetadataRoute } from "next";
import { MANGAS, isLive } from "@/lib/manga";
import { getChapterNumbers } from "@/lib/data";
import { SITE, chapterPath, chaptersPath, latestPath, mangaPath } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
  ];

  for (const m of MANGAS) {
    const live = isLive(m);
    entries.push({
      url: `${SITE.url}${mangaPath(m.slug)}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: live ? 0.9 : 0.6,
    });

    if (!live) continue;

    entries.push(
      {
        url: `${SITE.url}${chaptersPath(m.slug)}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      },
      {
        url: `${SITE.url}${latestPath(m.slug)}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      },
    );

    for (const n of getChapterNumbers(m.slug)) {
      entries.push({
        url: `${SITE.url}${chapterPath(m.slug, n)}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
