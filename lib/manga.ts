// Central registry of every manga on the site. This is the single source of
// truth: routes, SEO metadata, sitemap entries and the data layer all read
// from here. Adding a new colorized manga = drop its data into
// data/manga/<slug>/ and add an entry below with status "live".

export type MangaStatus = "live" | "coming-soon";

export interface Manga {
  /** URL slug, e.g. "one-piece" → /one-piece */
  slug: string;
  /** Display title, e.g. "One Piece" */
  title: string;
  /** Japanese / native title for schema.org alternateName + SEO */
  nativeTitle?: string;
  /** Other names people search for */
  altTitles: string[];
  author: string;
  publisher: string;
  genres: string[];
  status: MangaStatus;
  /** First year of serialization (schema.org datePublished / copy) */
  year: number;
  /** CDN base that serves this manga's colored page images.
   *  pageUrl() builds `${imageBase}/${chapter}/${page}.webp`. */
  imageBase: string;
  /** 1–2 sentence hook used on cards + meta descriptions. */
  tagline: string;
  /** Longer, keyword-rich synopsis for the manga landing page. */
  synopsis: string;
  /** Primary long-tail keywords this manga's pages target. */
  keywords: string[];
  /** Accent color (hex) used for subtle per-manga theming. */
  accent: string;
  /** Emoji/mark shown until real cover art is wired (never the brand logo). */
  mark: string;
  /** Rough total chapter count of the source series (for coming-soon copy). */
  totalChapters?: number;
}

const OP_IMAGE_BASE = (
  process.env.NEXT_PUBLIC_IMAGE_BASE ||
  "https://cdn.jsdelivr.net/gh/anon6968/op-color-pages@main/pages"
).replace(/\/$/, "");

export const MANGAS: Manga[] = [
  {
    slug: "one-piece",
    title: "One Piece",
    nativeTitle: "ワンピース",
    altTitles: ["One Piece Color", "One Piece Colored", "Colorized One Piece"],
    author: "Eiichiro Oda",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Fantasy", "Comedy"],
    status: "live",
    year: 1997,
    imageBase: OP_IMAGE_BASE,
    tagline:
      "Every chapter of Eiichiro Oda's pirate epic, digitally colorized in full HD.",
    synopsis:
      "Read the colorized One Piece manga online for free — every chapter of Eiichiro Oda's legendary series digitally colored in high definition. Follow Monkey D. Luffy and the Straw Hat Pirates from Romance Dawn and the East Blue, through Alabasta, Enies Lobby, Marineford, Dressrosa and Wano, all the way to the latest arc, now in vivid full color instead of black and white. No signup, no paywall — the fastest way to read One Piece in color on phone or desktop with pinch-to-zoom on every page.",
    keywords: [
      "colorized one piece manga",
      "one piece color manga",
      "one piece colored manga",
      "read one piece in color",
      "one piece full color",
      "one piece manga online free",
      "one piece colored chapters",
      "one piece digital color edition",
      "read one piece color free",
      "one piece manga color online",
    ],
    accent: "#ff3b4e",
    mark: "🏴‍☠️",
    totalChapters: 1130,
  },
  {
    slug: "naruto",
    title: "Naruto",
    nativeTitle: "ナルト",
    altTitles: ["Naruto Color", "Colorized Naruto", "Naruto Colored"],
    author: "Masashi Kishimoto",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Martial Arts", "Fantasy"],
    status: "coming-soon",
    year: 1999,
    imageBase: "",
    tagline:
      "Masashi Kishimoto's ninja saga, being digitally colorized chapter by chapter.",
    synopsis:
      "The colorized Naruto manga is coming to Colorized Manga. Every chapter of Masashi Kishimoto's ninja epic — from Naruto Uzumaki's academy days and the Chūnin Exams through the Search for Tsunade, the Sasuke Retrieval, Shippūden and the Fourth Great Ninja War — is being digitally colored in full HD. Follow Naruto, Sasuke and Sakura in vivid full color instead of black and white, free to read on any device.",
    keywords: [
      "colorized naruto manga",
      "naruto color manga",
      "naruto colored manga",
      "read naruto in color",
      "naruto full color",
      "naruto manga online free",
      "naruto colored chapters",
      "naruto shippuden colored manga",
    ],
    accent: "#f7a600",
    mark: "🍥",
    totalChapters: 700,
  },
  {
    slug: "bleach",
    title: "Bleach",
    nativeTitle: "ブリーチ",
    altTitles: ["Bleach Color", "Colorized Bleach", "Bleach Colored"],
    author: "Tite Kubo",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Supernatural"],
    status: "coming-soon",
    year: 2001,
    imageBase: "",
    tagline:
      "Tite Kubo's Soul Reaper classic, being digitally colorized in full HD.",
    synopsis:
      "The colorized Bleach manga is on its way. Every chapter of Tite Kubo's supernatural action series — Ichigo Kurosaki's rise as a Soul Reaper, the Soul Society arc, the Arrancar war and the Thousand-Year Blood War — is being digitally colored in high definition. Read Bleach in vivid full color online, free, on phone or desktop.",
    keywords: [
      "colorized bleach manga",
      "bleach color manga",
      "bleach colored manga",
      "read bleach in color",
      "bleach full color",
      "bleach manga online free",
      "bleach colored chapters",
      "bleach thousand year blood war colored",
    ],
    accent: "#ff6a3d",
    mark: "⚔️",
    totalChapters: 686,
  },
  {
    slug: "demon-slayer",
    title: "Demon Slayer",
    nativeTitle: "鬼滅の刃",
    altTitles: [
      "Kimetsu no Yaiba",
      "Demon Slayer Color",
      "Colorized Demon Slayer",
      "Kimetsu no Yaiba Color",
    ],
    author: "Koyoharu Gotouge",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Supernatural", "Historical"],
    status: "coming-soon",
    year: 2016,
    imageBase: "",
    tagline:
      "Koyoharu Gotouge's Kimetsu no Yaiba, being digitally colorized in full HD.",
    synopsis:
      "The colorized Demon Slayer (Kimetsu no Yaiba) manga is coming soon. Every chapter of Koyoharu Gotouge's smash-hit series — Tanjiro Kamado's quest to cure his sister Nezuko, the Hashira, and the war against Muzan and his Twelve Kizuki — is being digitally colored in high definition. Read Demon Slayer in vivid full color online, free.",
    keywords: [
      "colorized demon slayer manga",
      "demon slayer color manga",
      "kimetsu no yaiba colored manga",
      "read demon slayer in color",
      "demon slayer full color",
      "demon slayer manga online free",
      "demon slayer colored chapters",
    ],
    accent: "#2fbf71",
    mark: "🗡️",
    totalChapters: 205,
  },
  {
    slug: "death-note",
    title: "Death Note",
    nativeTitle: "デスノート",
    altTitles: ["Death Note Color", "Colorized Death Note", "Death Note Colored"],
    author: "Tsugumi Ohba, Takeshi Obata",
    publisher: "Shueisha",
    genres: ["Mystery", "Psychological", "Thriller", "Supernatural"],
    status: "coming-soon",
    year: 2003,
    imageBase: "",
    tagline:
      "Ohba & Obata's psychological thriller, being digitally colorized in full HD.",
    synopsis:
      "The colorized Death Note manga is on its way. Every chapter of Tsugumi Ohba and Takeshi Obata's psychological thriller — Light Yagami's deadly game against the detective L after finding a notebook that kills — is being digitally colored in high definition. Read Death Note in vivid full color online, free, on any device.",
    keywords: [
      "colorized death note manga",
      "death note color manga",
      "death note colored manga",
      "read death note in color",
      "death note full color",
      "death note manga online free",
      "death note colored chapters",
    ],
    accent: "#a06bff",
    mark: "📓",
    totalChapters: 108,
  },
  {
    slug: "fullmetal-alchemist",
    title: "Fullmetal Alchemist",
    nativeTitle: "鋼の錬金術師",
    altTitles: [
      "Hagane no Renkinjutsushi",
      "FMA",
      "Fullmetal Alchemist Color",
      "Colorized Fullmetal Alchemist",
    ],
    author: "Hiromu Arakawa",
    publisher: "Square Enix",
    genres: ["Action", "Adventure", "Fantasy", "Steampunk"],
    status: "coming-soon",
    year: 2001,
    imageBase: "",
    tagline:
      "Hiromu Arakawa's alchemy epic, being digitally colorized in full HD.",
    synopsis:
      "The colorized Fullmetal Alchemist manga is coming soon. Every chapter of Hiromu Arakawa's beloved series — brothers Edward and Alphonse Elric and their search for the Philosopher's Stone to restore their bodies — is being digitally colored in high definition. Read Fullmetal Alchemist in vivid full color online, free.",
    keywords: [
      "colorized fullmetal alchemist manga",
      "fullmetal alchemist color manga",
      "fullmetal alchemist colored manga",
      "read fullmetal alchemist in color",
      "fma full color",
      "fullmetal alchemist manga online free",
      "fullmetal alchemist colored chapters",
    ],
    accent: "#d9c14a",
    mark: "⚗️",
    totalChapters: 116,
  },
];

const BY_SLUG = new Map(MANGAS.map((m) => [m.slug, m]));

export function getManga(slug: string): Manga | undefined {
  return BY_SLUG.get(slug);
}

export function getMangaSlugs(): string[] {
  return MANGAS.map((m) => m.slug);
}

export function liveMangas(): Manga[] {
  return MANGAS.filter((m) => m.status === "live");
}

export function comingSoonMangas(): Manga[] {
  return MANGAS.filter((m) => m.status === "coming-soon");
}

export function isLive(m: Manga): boolean {
  return m.status === "live";
}
