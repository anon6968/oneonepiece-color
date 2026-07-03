import type { Manga } from "./manga";

// Hub-level site config. The apex colorizedmangas.com is the multi-manga hub;
// each manga lives at /<slug> beneath it.
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://colorizedmangas.com").replace(/\/$/, ""),
  name: "Colorized Manga",
  short: "Colorized Manga",
  tagline: "Read manga in full color, online and free.",
  description:
    "Read colorized manga online for free. One Piece, Naruto, Bleach, Demon Slayer and more — every chapter digitally colorized in full HD. Fast, mobile-friendly reader with zoom, no signup.",
  keywords: [
    "colorized manga",
    "colored manga online",
    "read manga in color",
    "colorized manga free",
    "full color manga",
    "manga in color online",
    "digital colored manga",
    "colorized manga reader",
  ],
  twitter: "@colorizedmanga",
} as const;

/* ----------------------------- URL helpers ------------------------------ */

export function mangaPath(slug: string) {
  return `/${slug}`;
}

export function chaptersPath(slug: string) {
  return `/${slug}/chapters`;
}

export function latestPath(slug: string) {
  return `/${slug}/latest`;
}

export function chapterPath(slug: string, chapter: number) {
  return `/${slug}/chapter/${chapter}`;
}

/** Absolute page-image URL for a manga's chapter page. */
export function pageUrl(m: Manga, chapter: number, page: number) {
  const p = String(page).padStart(3, "0");
  return `${m.imageBase.replace(/\/$/, "")}/${chapter}/${p}.webp`;
}

/* ------------------------------ SEO titles ------------------------------ */

export function chapterTitle(m: Manga, chapter: number, arc?: string) {
  const base = `${m.title} Chapter ${chapter} Colored`;
  return arc && arc !== m.title ? `${base}: ${arc}` : base;
}

export function chapterMetaTitle(m: Manga, chapter: number, arc?: string) {
  return `${chapterTitle(m, chapter, arc)} — Read in Full Color Online Free`;
}
