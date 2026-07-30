import type { Manga } from "./manga";

// Hub-level site config. The apex colorizedmangas.com is the multi-manga hub;
// each manga lives at /<slug> beneath it.
export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://colorizedmangas.com").replace(/\/$/, ""),
  name: "Colorized Manga",
  short: "Colorized Manga",
  tagline: "Read manga in full color, online and free.",
  description:
    "Read colorized manga online free — One Piece, Naruto, Bleach & more, every chapter digitally colored in full HD. Fast mobile reader, no signup.",
  keywords: [
    "colorized manga",
    "colored manga online",
    "read manga in color",
    "colorized manga free",
    "full color manga",
    "manga in color online",
    "digital colored manga",
    "colorized manga reader",
    // British-English spelling variants — same intent, distinct queries. We own
    // colourisedmanga.com; capturing the spelling on-site lets the primary
    // domain rank for both "colorized" (US) and "colourised" (UK) searches.
    "colourised manga",
    "coloured manga online",
    "colour manga",
  ],
  twitter: "@colorizedmanga",
  // Content-removal / takedown address. colorizedmangas.com has no mailbox (no MX
  // records), so a removals@colorizedmangas.com address bounces — point takedowns
  // at the real, monitored inbox instead so DMCA/legal contact actually works.
  // (Optional upgrade: Cloudflare Email Routing can forward a branded
  // removals@colorizedmangas.com here for free once the destination is verified.)
  contact: "anon69contact@proton.me",
  // General contact / support inbox shown on the Contact page (real, monitored).
  email: "anon69contact@proton.me",
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
