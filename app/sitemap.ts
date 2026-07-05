import type { MetadataRoute } from "next";
import { MANGAS, isLive } from "@/lib/manga";
import { getIndex, getChapterNumbers } from "@/lib/data";
import { SITE, latestPath, listPath, mangaPath, pageUrl, readPath } from "@/lib/site";

// Chapter pages never change once colored, so we give them a stable lastmod
// instead of `new Date()` — reporting "changed now" on every deploy trains
// Google to distrust our lastmod and wastes crawl budget re-checking finished
// pages. Hub pages (home / per-series / latest) genuinely update as new
// chapters land, so those keep a fresh timestamp.
const STABLE = new Date("2026-01-01T00:00:00Z");

/** Absolute cover image for a series (poster if set, else first page). */
function seriesCover(slug: string, poster?: string): string | undefined {
  if (poster) return `${SITE.url}${poster.startsWith("/") ? poster : `/${poster}`}`;
  const first = getIndex(slug)[0]?.chapter;
  const m = MANGAS.find((x) => x.slug === slug)!;
  return first ? pageUrl(m, first, 1) : undefined;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: SITE.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/dmca`, lastModified: STABLE, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/terms`, lastModified: STABLE, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/privacy`, lastModified: STABLE, changeFrequency: "yearly", priority: 0.2 },
  ];

  for (const m of MANGAS) {
    const live = isLive(m);
    const cover = seriesCover(m.slug, m.poster);
    entries.push({
      url: `${SITE.url}${mangaPath(m.slug)}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: live ? 0.9 : 0.6,
      ...(cover ? { images: [cover] } : {}),
    });

    if (!live) continue;

    entries.push(
      {
        url: `${SITE.url}${listPath(m)}`,
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
      // Image sitemap entry: the chapter cover is the colored page 1. This is
      // the single biggest discovery lever for a visual site — it opens the
      // door to Google Images traffic for every colored page.
      entries.push({
        url: `${SITE.url}${readPath(m, n)}`,
        lastModified: STABLE,
        changeFrequency: "monthly",
        priority: 0.7,
        images: [pageUrl(m, n, 1)],
      });
    }
  }

  return entries;
}
