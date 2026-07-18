// Central registry of every manga on the site. This is the single source of
// truth: routes, SEO metadata, sitemap entries and the data layer all read
// from here. Adding a new colorized manga = drop its data into
// data/manga/<slug>/ and add an entry below with status "live".

import autoSeriesRaw from "../data/auto-series.json";

export type MangaStatus = "live" | "coming-soon";

/** How much of the series we actually serve in color — drives the honesty
 *  badge so nothing black-and-white is ever passed off as colorized.
 *   full    = the whole (or nearly whole) series is in color
 *   partial = only some chapters are colored (see colorNote)
 *   none    = no genuine color source exists; black & white only */
export type MangaColor = "full" | "partial" | "none";

/** Reading unit the series is stored/served in. One Piece & Bleach are
 *  per-chapter; Naruto's colored edition ships as full volumes. */
export type MangaUnit = "chapter" | "volume";

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
  /** How much of the series is actually in color (honesty badge). */
  color: MangaColor;
  /** Clarifier shown for partial/none, e.g. "Final arc only (ch 140–205)". */
  colorNote?: string;
  /** Reading unit — "chapter" (default) or "volume". Drives routes + copy. */
  unit: MangaUnit;
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
  /** Poster art for the series card (path under public/). Cards fall back
   *  to page 1 of chapter/volume 1 when unset. */
  poster?: string;
  /** CSS object-position for the poster/cover crop (default "top"). */
  posterPosition?: string;
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

const BLEACH_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/bleach-color-pages@main/pages";
const NARUTO_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/naruto-color-pages@main/pages";
const CHAINSAW_MAN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/chainsaw-man-color-pages@main/pages";
const HUNTER_X_HUNTER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/hunter-x-hunter-color-pages@main/pages";
const DEMON_SLAYER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/demon-slayer-color-pages@main/pages";
const DEATH_NOTE_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/death-note-color-pages@main/pages";
const RUROUNI_KENSHIN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/rurouni-kenshin-color-pages@main/pages";
const ATTACK_ON_TITAN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/attack-on-titan-color-pages@main/pages";
const JUJUTSU_KAISEN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/jujutsu-kaisen-color-pages@main/pages";

const HAND_MANGAS: Manga[] = [
  {
    slug: "one-piece",
    color: "full",
    title: "One Piece",
    nativeTitle: "ワンピース",
    altTitles: ["One Piece Color", "One Piece Colored", "Colorized One Piece"],
    author: "Eiichiro Oda",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Fantasy", "Comedy"],
    status: "live",
    unit: "chapter",
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
    poster: "/covers/one-piece.jpg",
    posterPosition: "50% 20%",
    accent: "#ff3b4e",
    mark: "🏴‍☠️",
    totalChapters: 1130,
  },
  {
    slug: "naruto",
    color: "full",
    title: "Naruto",
    nativeTitle: "ナルト",
    altTitles: ["Naruto Color", "Colorized Naruto", "Naruto Colored"],
    author: "Masashi Kishimoto",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Martial Arts", "Fantasy"],
    status: "live",
    unit: "volume",
    year: 1999,
    imageBase: NARUTO_IMAGE_BASE,
    tagline:
      "Masashi Kishimoto's complete ninja saga — all 72 volumes digitally colorized in full HD.",
    synopsis:
      "Read the colorized Naruto manga online for free — the complete series, all 72 volumes of Masashi Kishimoto's ninja epic digitally colored in high definition. Follow Naruto Uzumaki from his academy days and the Chūnin Exams through the Search for Tsunade, the Sasuke Retrieval, Shippūden and the Fourth Great Ninja War, all the way to the final battle — in vivid full color instead of black and white. No signup, no paywall — a fast reader with zoom on every page, on phone or desktop.",
    keywords: [
      "colorized naruto manga",
      "naruto color manga",
      "naruto colored manga",
      "read naruto in color",
      "naruto full color",
      "naruto manga online free",
      "naruto colored volumes",
      "naruto full color edition",
      "naruto shippuden colored manga",
      "read naruto color free",
    ],
    poster: "/covers/naruto.jpg",
    posterPosition: "50% 20%",
    accent: "#f7a600",
    mark: "🍥",
    totalChapters: 72,
  },
  {
    slug: "bleach",
    color: "full",
    title: "Bleach",
    nativeTitle: "ブリーチ",
    altTitles: ["Bleach Color", "Colorized Bleach", "Bleach Colored"],
    author: "Tite Kubo",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Supernatural"],
    status: "live",
    unit: "chapter",
    year: 2001,
    imageBase: BLEACH_IMAGE_BASE,
    tagline:
      "Tite Kubo's Soul Reaper classic — the complete series digitally colorized in full HD.",
    synopsis:
      "Read the colorized Bleach manga online for free — the complete series, every chapter of Tite Kubo's supernatural action epic digitally colored in high definition. Follow Ichigo Kurosaki's rise as a Substitute Soul Reaper through the Soul Society rescue, the Arrancar war, the Lost Agent arc and the Thousand-Year Blood War, all in vivid full color instead of black and white. No signup, no paywall — a fast mobile-friendly reader with zoom on every page.",
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
    poster: "/covers/bleach.jpg",
    posterPosition: "50% 40%",
    accent: "#ff6a3d",
    mark: "⚔️",
    totalChapters: 686,
  },
  {
    slug: "demon-slayer",
    color: "partial",
    colorNote: "Final arc only — chapters 140–205 (the only part colored in English)",
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
    status: "live",
    unit: "chapter",
    year: 2016,
    imageBase: DEMON_SLAYER_IMAGE_BASE,
    tagline:
      "Koyoharu Gotouge's Kimetsu no Yaiba — the final arc in official full color.",
    synopsis:
      "Read the colorized Demon Slayer (Kimetsu no Yaiba) manga in official full color. The climactic final arc — chapters 140–205, the Infinity Castle battles and Sunrise Countdown against Muzan — is available now in vivid color; the earlier chapters aren't colored in English yet. No signup, a fast mobile-friendly reader with zoom on every page.",
    keywords: [
      "colorized demon slayer manga",
      "demon slayer color manga",
      "kimetsu no yaiba colored manga",
      "read demon slayer in color",
      "demon slayer full color",
      "demon slayer manga online free",
      "demon slayer colored chapters",
    ],
    poster: "/covers/demon-slayer.jpg",
    posterPosition: "center",
    accent: "#2fbf71",
    mark: "🗡️",
    totalChapters: 205,
  },
  {
    slug: "death-note",
    color: "partial",
    colorNote: "Chapters 1–10 only — the rest isn't colored yet",
    title: "Death Note",
    nativeTitle: "デスノート",
    altTitles: ["Death Note Color", "Colorized Death Note", "Death Note Colored"],
    author: "Tsugumi Ohba, Takeshi Obata",
    publisher: "Shueisha",
    genres: ["Mystery", "Psychological", "Thriller", "Supernatural"],
    status: "live",
    unit: "chapter",
    year: 2003,
    imageBase: DEATH_NOTE_IMAGE_BASE,
    tagline:
      "Ohba & Obata's psychological thriller — the opening arc in official color.",
    synopsis:
      "Read the colorized Death Note manga in official full color. The opening chapters (1–10) are available now in vivid color, with more added as they're colorized — Light Yagami's deadly game against the detective L after finding a notebook that kills. No signup, a fast mobile-friendly reader with zoom on every page.",
    keywords: [
      "colorized death note manga",
      "death note color manga",
      "death note colored manga",
      "read death note in color",
      "death note full color",
      "death note manga online free",
      "death note colored chapters",
    ],
    poster: "/covers/death-note.jpg",
    posterPosition: "50% 28%",
    accent: "#a06bff",
    mark: "📓",
    totalChapters: 108,
  },
  {
    slug: "fullmetal-alchemist",
    color: "none",
    colorNote: "Black & white now — full-color edition coming soon",
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
    unit: "chapter",
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
  {
    slug: "attack-on-titan",
    color: "partial",
    colorNote: "Fan-colored — a partial run of chapters in color",
    title: "Attack on Titan",
    nativeTitle: "進撃の巨人",
    altTitles: [
      "Shingeki no Kyojin",
      "AoT",
      "Attack on Titan Color",
      "Colorized Attack on Titan",
    ],
    author: "Hajime Isayama",
    publisher: "Kodansha",
    genres: ["Action", "Dark Fantasy", "Post-Apocalyptic", "Drama"],
    status: "live",
    unit: "chapter",
    year: 2009,
    imageBase: ATTACK_ON_TITAN_IMAGE_BASE,
    tagline:
      "Hajime Isayama's titan epic, being digitally colorized in full HD.",
    synopsis:
      "The colorized Attack on Titan (Shingeki no Kyojin) manga is coming soon. Every chapter of Hajime Isayama's dark fantasy epic — Eren Yeager, Mikasa and Armin's war against the man-eating Titans beyond the walls, and the truths of the basement, Marley and the Rumbling — is being digitally colored in high definition. Read Attack on Titan in vivid full color online, free.",
    keywords: [
      "colorized attack on titan manga",
      "attack on titan color manga",
      "shingeki no kyojin colored manga",
      "read attack on titan in color",
      "attack on titan full color",
      "attack on titan manga online free",
      "attack on titan colored chapters",
    ],
    accent: "#6b8f71",
    mark: "🧱",
    totalChapters: 139,
  },
  {
    slug: "hunter-x-hunter",
    color: "full",
    title: "Hunter × Hunter",
    nativeTitle: "ハンター×ハンター",
    altTitles: [
      "HxH",
      "Hunter Hunter",
      "Hunter x Hunter Color",
      "Colorized Hunter x Hunter",
    ],
    author: "Yoshihiro Togashi",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Fantasy"],
    status: "live",
    unit: "chapter",
    year: 1998,
    imageBase: HUNTER_X_HUNTER_IMAGE_BASE,
    tagline:
      "Yoshihiro Togashi's adventure epic — in official full color, HD.",
    synopsis:
      "Read the colorized Hunter × Hunter manga online for free — Yoshihiro Togashi's adventure epic in official full color instead of black and white. Follow Gon Freecss's search for his father Ging through the Hunter Exam, Yorknew City, Greed Island and the Chimera Ant war, digitally colored in high definition. No signup, a fast mobile-friendly reader with zoom on every page.",
    keywords: [
      "colorized hunter x hunter manga",
      "hunter x hunter color manga",
      "hunter x hunter colored manga",
      "read hunter x hunter in color",
      "hunter x hunter full color",
      "hxh manga online free",
      "hunter x hunter colored chapters",
    ],
    accent: "#3fae7a",
    mark: "🎯",
    totalChapters: 400,
  },
  {
    slug: "chainsaw-man",
    color: "full",
    title: "Chainsaw Man",
    nativeTitle: "チェンソーマン",
    altTitles: ["Chainsawman", "Chainsaw Man Color", "Colorized Chainsaw Man"],
    author: "Tatsuki Fujimoto",
    publisher: "Shueisha",
    genres: ["Action", "Horror", "Supernatural", "Dark Fantasy"],
    status: "live",
    unit: "chapter",
    year: 2018,
    imageBase: CHAINSAW_MAN_IMAGE_BASE,
    tagline:
      "Tatsuki Fujimoto's devil-hunter horror — Part 1 in official full color, plus the complete Part 2.",
    synopsis:
      "Read the colorized Chainsaw Man manga online for free — Part 1 (chapters 1–97) in vivid official full color instead of black and white. Follow Denji and his chainsaw devil Pochita, the Public Safety Devil Hunters, Makima and the war against the devils, every chapter digitally colored in high definition. Part 2, the Academy Saga (chapters 98 onward), is included in full so you can read the whole story to date — shown in black & white, clearly labeled, until an official color edition is released. No signup, no paywall — a fast, mobile-friendly reader with pinch-to-zoom on every page.",
    keywords: [
      "colorized chainsaw man manga",
      "chainsaw man color manga",
      "chainsaw man colored manga",
      "read chainsaw man in color",
      "chainsaw man full color",
      "chainsaw man manga online free",
      "chainsaw man colored chapters",
    ],
    poster: "/covers/chainsaw-man.jpg",
    posterPosition: "center",
    accent: "#ee5a24",
    mark: "🪚",
    totalChapters: 232,
  },
  {
    slug: "black-clover",
    color: "none",
    colorNote: "Black & white now — full-color edition coming soon",
    title: "Black Clover",
    nativeTitle: "ブラッククローバー",
    altTitles: ["Black Clover Color", "Colorized Black Clover", "Black Clover Colored"],
    author: "Yūki Tabata",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Fantasy", "Magic"],
    status: "coming-soon",
    unit: "chapter",
    year: 2015,
    imageBase: "",
    tagline:
      "Yūki Tabata's magic-knight shonen, being digitally colorized in full HD.",
    synopsis:
      "The colorized Black Clover manga is on its way. Every chapter of Yūki Tabata's magic-knight epic — Asta, born with no magic in a world of mages, and his rival Yuno racing to become the Wizard King — is being digitally colored in high definition. Read Black Clover in vivid full color online, free.",
    keywords: [
      "colorized black clover manga",
      "black clover color manga",
      "black clover colored manga",
      "read black clover in color",
      "black clover full color",
      "black clover manga online free",
      "black clover colored chapters",
    ],
    accent: "#3dbb6b",
    mark: "🍀",
    totalChapters: 370,
  },
  {
    slug: "rurouni-kenshin",
    color: "partial",
    colorNote: "Chapters 1–81 in official color (the rest isn't colored yet)",
    title: "Rurouni Kenshin",
    nativeTitle: "るろうに剣心",
    altTitles: ["Samurai X", "Rurouni Kenshin Color", "Colorized Rurouni Kenshin"],
    author: "Nobuhiro Watsuki",
    publisher: "Shueisha",
    genres: ["Action", "Historical", "Samurai", "Drama"],
    status: "live",
    unit: "chapter",
    year: 1994,
    imageBase: RUROUNI_KENSHIN_IMAGE_BASE,
    tagline:
      "Watsuki's Meiji-era samurai epic — the early chapters in official full color.",
    synopsis:
      "Read the colorized Rurouni Kenshin manga — the official color edition of Nobuhiro Watsuki's Meiji-era samurai classic, following the wandering swordsman Himura Kenshin and his vow never to kill again. The opening chapters are available in vivid full color; more are added as they're colorized.",
    keywords: [
      "colorized rurouni kenshin manga",
      "rurouni kenshin color manga",
      "samurai x colored manga",
      "read rurouni kenshin in color",
      "rurouni kenshin full color",
    ],
    accent: "#c0392b",
    mark: "🗡️",
    totalChapters: 255,
  },
  {
    slug: "my-hero-academia",
    color: "none",
    colorNote: "Black & white now — full-color edition coming soon",
    title: "My Hero Academia",
    nativeTitle: "僕のヒーローアカデミア",
    altTitles: ["Boku no Hero Academia", "MHA", "BNHA"],
    author: "Kōhei Horikoshi",
    publisher: "Shueisha",
    genres: ["Action", "Superhero", "Adventure"],
    status: "coming-soon",
    unit: "chapter",
    year: 2014,
    imageBase: "",
    tagline: "Kōhei Horikoshi's superhero epic — black & white only, no color edition.",
    synopsis:
      "My Hero Academia — Izuku Midoriya's journey from Quirkless boy to hero at U.A. High. No genuine colorized edition of this series exists yet, so it is listed here in black & white only; we do not have a color version.",
    keywords: ["my hero academia manga", "boku no hero academia", "mha manga online"],
    accent: "#2ecc71",
    mark: "💥",
    totalChapters: 430,
  },
  {
    slug: "jujutsu-kaisen",
    color: "partial",
    colorNote: "Fan-colored — a partial run of chapters in color",
    title: "Jujutsu Kaisen",
    nativeTitle: "呪術廻戦",
    altTitles: ["JJK", "Sorcery Fight"],
    author: "Gege Akutami",
    publisher: "Shueisha",
    genres: ["Action", "Supernatural", "Dark Fantasy"],
    status: "live",
    unit: "chapter",
    year: 2018,
    imageBase: JUJUTSU_KAISEN_IMAGE_BASE,
    tagline: "Gege Akutami's curse-hunter hit — a fan-colored run of chapters in full color.",
    synopsis:
      "Jujutsu Kaisen — Yuji Itadori and the Tokyo Jujutsu High sorcerers against cursed spirits and Sukuna. Read the fan-colored chapters in full color, HD, free — no official color edition exists, so this partial colorization is the closest thing to Jujutsu Kaisen in color.",
    keywords: ["jujutsu kaisen colored", "jjk colored manga", "jujutsu kaisen color", "read jujutsu kaisen in color"],
    accent: "#8e44ad",
    mark: "👊",
    totalChapters: 271,
  },
  {
    slug: "tokyo-ghoul",
    color: "none",
    colorNote: "Black & white now — full-color edition coming soon",
    title: "Tokyo Ghoul",
    nativeTitle: "東京喰種",
    altTitles: ["Tokyo Ghoul:re", "Toukyou Kushu"],
    author: "Sui Ishida",
    publisher: "Shueisha",
    genres: ["Dark Fantasy", "Horror", "Supernatural"],
    status: "coming-soon",
    unit: "chapter",
    year: 2011,
    imageBase: "",
    tagline: "Sui Ishida's dark ghoul saga — black & white only, no color edition.",
    synopsis:
      "Tokyo Ghoul — Ken Kaneki caught between humans and flesh-eating ghouls. No genuine colorized edition of this series exists (only an art book), so it is listed here in black & white only; we do not have a color version.",
    keywords: ["tokyo ghoul manga", "tokyo ghoul re manga", "tokyo ghoul black and white"],
    accent: "#c0392b",
    mark: "🎭",
    totalChapters: 179,
  },
  {
    slug: "spy-x-family",
    color: "none",
    colorNote: "Black & white now — full-color edition coming soon",
    title: "Spy × Family",
    nativeTitle: "スパイファミリー",
    altTitles: ["Spy Family", "SxF"],
    author: "Tatsuya Endo",
    publisher: "Shueisha",
    genres: ["Action", "Comedy", "Slice of Life"],
    status: "coming-soon",
    unit: "chapter",
    year: 2019,
    imageBase: "",
    tagline: "Tatsuya Endo's spy-family comedy — black & white only, no complete color edition.",
    synopsis:
      "Spy × Family — spy Twilight, assassin Yor and telepath Anya as an undercover family. No complete colorized English edition exists, so it is listed here in black & white only; we do not have a full color version.",
    keywords: ["spy x family manga", "spy family manga online", "spy x family black and white"],
    accent: "#e67e22",
    mark: "🕶️",
    totalChapters: 100,
  },
];

// Auto-registered series (added by tools/register_series.py). Hand-authored
// entries above always win on slug conflicts; auto entries only add new slugs.
const AUTO_MANGAS = autoSeriesRaw as Manga[];
const _handSlugs = new Set(HAND_MANGAS.map((m) => m.slug));
export const MANGAS: Manga[] = [
  ...HAND_MANGAS,
  ...AUTO_MANGAS.filter((m) => !_handSlugs.has(m.slug)),
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
