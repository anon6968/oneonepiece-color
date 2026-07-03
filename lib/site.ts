export const SITE = {
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://onepiece.colorizedmangas.com").replace(/\/$/, ""),
  name: "One Piece Color Manga",
  short: "OP Color",
  tagline: "Read One Piece in full color, online and free.",
  description:
    "Read the One Piece colored manga online for free. Every chapter of One Piece digitally colorized in full HD — from Romance Dawn through the latest arc. Fast, mobile-friendly reader with zoom.",
  keywords: [
    "one piece color manga",
    "colorized one piece manga",
    "one piece colored manga",
    "read one piece in color",
    "one piece full color",
    "one piece manga online",
    "one piece colored chapters",
    "one piece digital colored",
    "read one piece color free",
    "one piece manga color online",
  ],
  twitter: "@onepiece",
} as const;

export const IMAGE_BASE = (
  process.env.NEXT_PUBLIC_IMAGE_BASE ||
  "https://cdn.jsdelivr.net/gh/anon6968/op-color-pages@main/pages"
).replace(/\/$/, "");

export function pageUrl(chapter: number, page: number) {
  const p = String(page).padStart(3, "0");
  return `${IMAGE_BASE}/${chapter}/${p}.webp`;
}

export function chapterPath(chapter: number) {
  return `/read/${chapter}`;
}

export function chapterTitle(chapter: number, arc?: string) {
  return arc && arc !== "One Piece"
    ? `One Piece Color — Chapter ${chapter}: ${arc}`
    : `One Piece Color — Chapter ${chapter}`;
}
