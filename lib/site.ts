import type { Manga } from "./manga";

// Hub-level site config. The apex colorizedmangas.com is the multi-manga hub;
// each manga lives at /<slug> beneath it.
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://colorizedmangas.com").replace(/\/$/, ""),
  name: "Colorized Manga",
  short: "Colorized Manga",
  tagline: "Read manga in full color, online and free.",
  description:
    "Read colorized manga online for free. One Piece, Naruto, Bleach and more — every chapter digitally colorized in full HD. Fast, mobile-friendly reader with zoom, no signup.",
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
  // Address for content-removal / takedown requests. Point this at a real inbox.
  contact: "removals@colorizedmangas.com",
} as const;

/* ------------------------------ Unit labels ----------------------------- */

/** "Chapter" or "Volume" — the reading unit this manga is served in. */
export function unitLabel(m: Manga): "Chapter" | "Volume" {
  return m.unit === "volume" ? "Volume" : "Chapter";
}

export function unitLabelLower(m: Manga): "chapter" | "volume" {
  return m.unit === "volume" ? "volume" : "chapter";
}

export function unitLabelPlural(m: Manga): "chapters" | "volumes" {
  return m.unit === "volume" ? "volumes" : "chapters";
}

/** Short label used in tight UI spots: "Ch." / "Vol." */
export function unitAbbrev(m: Manga): "Ch." | "Vol." {
  return m.unit === "volume" ? "Vol." : "Ch.";
}

/* ----------------------------- URL helpers ------------------------------ */

export function mangaPath(slug: string) {
  return `/${slug}`;
}

/** Listing page for a manga's reading units (/x/chapters or /x/volumes). */
export function listPath(m: Manga) {
  return `/${m.slug}/${unitLabelPlural(m)}`;
}

export function latestPath(slug: string) {
  return `/${slug}/latest`;
}

/** Reader page for one unit (/x/chapter/12 or /x/volume/12). */
export function readPath(m: Manga, n: number) {
  return `/${m.slug}/${unitLabelLower(m)}/${n}`;
}

/** Absolute page-image URL for a manga's unit page. */
export function pageUrl(m: Manga, chapter: number, page: number) {
  const p = String(page).padStart(3, "0");
  return `${m.imageBase.replace(/\/$/, "")}/${chapter}/${p}.webp`;
}

/* ------------------------------ SEO titles ------------------------------ */

export function unitTitle(m: Manga, n: number, arc?: string, title?: string) {
  const base = `${m.title} ${unitLabel(m)} ${n} Colored`;
  if (title) return `${base}: ${title}`;
  return arc && arc !== m.title ? `${base}: ${arc}` : base;
}

export function unitMetaTitle(m: Manga, n: number, arc?: string, title?: string) {
  return `${unitTitle(m, n, arc, title)} — Read in Full Color Online Free`;
}
