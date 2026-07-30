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
  /** When true, the series is kept in the repo as source data but removed from
   *  the live site — filtered out of MANGAS, so it vanishes from the grid,
   *  schema, sitemap, feed and its routes 404. Flip to false to restore. */
  hidden?: boolean;
  /** Franchise "hub" series (e.g. JoJo): the sub-series it groups. Its page
   *  renders these as Part sections instead of a chapter list, and the child
   *  slugs are hidden from the landing/footer grids — but their individual
   *  pages stay live and indexed (no URL breakage). */
  parts?: { slug: string; title: string }[];
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
const FULLMETAL_ALCHEMIST_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/fullmetal-alchemist-color-pages@main/pages";
const BERSERK_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/berserk-color-pages@main/pages";
const MOB_PSYCHO_100_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/mob-psycho-100-color-pages@main/pages";
const DR_STONE_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/dr-stone-color-pages@main/pages";
const BLACK_CLOVER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/black-clover-color-pages@main/pages";
const BLUE_LOCK_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/blue-lock-color-pages@main/pages";
const KAIJU_NO_8_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/kaiju-no-8-color-pages@main/pages";
const HELLS_PARADISE_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/hells-paradise-color-pages@main/pages";
const DANDADAN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/dandadan-color-pages@main/pages";

const TOKYO_GHOUL_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/tokyo-ghoul-color-pages@main/pages";
const TOKYO_REVENGERS_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/tokyo-revengers-color-pages@main/pages";
const FIRE_FORCE_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/fire-force-color-pages@main/pages";
const VINLAND_SAGA_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/vinland-saga-color-pages@main/pages";
const THE_PROMISED_NEVERLAND_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/the-promised-neverland-color-pages@main/pages";
const FAIRY_TAIL_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/fairy-tail-color-pages@main/pages";
const YU_YU_HAKUSHO_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/yu-yu-hakusho-color-pages@main/pages";
const BLUE_EXORCIST_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/blue-exorcist-color-pages@main/pages";
const FOOD_WARS_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/food-wars-color-pages@main/pages";
const SEVEN_DEADLY_SINS_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/seven-deadly-sins-color-pages@main/pages";
const WORLD_TRIGGER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/world-trigger-color-pages@main/pages";
const MASHLE_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/mashle-color-pages@main/pages";
const N20TH_CENTURY_BOYS_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/20th-century-boys-color-pages@main/pages";
const SOLO_LEVELING_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/solo-leveling-color-pages@main/pages";
const HAIKYU_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/haikyu-color-pages@main/pages";
const KINGDOM_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/kingdom-color-pages@main/pages";
const OSHI_NO_KO_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/oshi-no-ko-color-pages@main/pages";
const BLACK_BUTLER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/black-butler-color-pages@main/pages";
const SOUL_EATER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/soul-eater-color-pages@main/pages";
const NORAGAMI_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/noragami-color-pages@main/pages";
const GOBLIN_SLAYER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/goblin-slayer-color-pages@main/pages";
const GOODNIGHT_PUNPUN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/goodnight-punpun-color-pages@main/pages";

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
    colorNote: "Colored where available — remaining chapters in HD black & white, full color coming soon",
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
    colorNote: "Colored where available — remaining chapters in HD black & white, full color coming soon",
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
    colorNote: "Complete series in black & white — free to read",
    title: "Fullmetal Alchemist",
    nativeTitle: "鋼の錬金術師",
    altTitles: [
      "Hagane no Renkinjutsushi",
      "FMA",
      "Fullmetal Alchemist Manga",
    ],
    author: "Hiromu Arakawa",
    publisher: "Square Enix",
    genres: ["Action", "Adventure", "Fantasy", "Steampunk"],
    status: "live",
    unit: "chapter",
    year: 2001,
    imageBase: FULLMETAL_ALCHEMIST_IMAGE_BASE,
    tagline:
      "Hiromu Arakawa's alchemy epic — the complete manga in HD black & white, free.",
    synopsis:
      "Read Fullmetal Alchemist online free — the complete manga in high-quality black & white. Brothers Edward and Alphonse Elric break the ultimate taboo of alchemy and set out to find the Philosopher's Stone to restore their bodies. No official full-color edition exists, so every chapter of Hiromu Arakawa's beloved series is hosted here in black & white, clearly labeled — a fast, mobile-friendly reader with pinch-to-zoom on every page. No signup, no paywall.",
    keywords: [
      "fullmetal alchemist manga online free",
      "read fullmetal alchemist manga",
      "fullmetal alchemist manga black and white",
      "fma full manga",
      "fullmetal alchemist brotherhood manga",
    ],
    accent: "#d9c14a",
    mark: "⚗️",
    totalChapters: 108,
  },
  {
    slug: "attack-on-titan",
    color: "partial",
    colorNote: "Colored where available — remaining chapters in HD black & white, full color coming soon",
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
    colorNote: "Complete series in black & white — free to read",
    title: "Black Clover",
    nativeTitle: "ブラッククローバー",
    altTitles: ["Black Clover Manga", "Bulakku Kurōbā"],
    author: "Yūki Tabata",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Fantasy", "Magic"],
    status: "live",
    unit: "chapter",
    year: 2015,
    imageBase: BLACK_CLOVER_IMAGE_BASE,
    tagline:
      "Yūki Tabata's magic-knight shonen — the manga in HD black & white, free.",
    synopsis:
      "Read Black Clover online free — the manga in high-quality black & white. Asta, born with no magic in a world where it's everything, and his rival Yuno chase the same dream: to become the Wizard King. No official full-color edition exists, so every chapter of Yūki Tabata's magic-knight epic is hosted here in black & white, clearly labeled — a fast, mobile-friendly reader with pinch-to-zoom on every page. No signup, no paywall.",
    keywords: [
      "black clover manga online free",
      "read black clover manga",
      "black clover manga black and white",
      "black clover full manga",
      "asta black clover manga",
    ],
    accent: "#3dbb6b",
    mark: "🍀",
    totalChapters: 392,
  },
  {
    slug: "rurouni-kenshin",
    color: "partial",
    colorNote: "Colored where available — remaining chapters in HD black & white, full color coming soon",
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
    colorNote: "Colored where available — remaining chapters in HD black & white, full color coming soon",
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
    poster: "/covers/jujutsu-kaisen-yuji.png",
    posterPosition: "center",
    accent: "#8e44ad",
    mark: "👊",
    totalChapters: 271,
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
  {
    slug: "berserk",
    color: "none",
    colorNote: "Complete series in black & white — free to read",
    title: "Berserk",
    nativeTitle: "ベルセルク",
    altTitles: ["Berserk Manga", "Berserk Colored"],
    author: "Kentaro Miura",
    publisher: "Hakusensha",
    genres: ["Action", "Dark Fantasy", "Horror", "Tragedy"],
    status: "live",
    unit: "chapter",
    year: 1989,
    imageBase: BERSERK_IMAGE_BASE,
    tagline:
      "Kentaro Miura's dark-fantasy masterpiece — the complete manga in HD black & white, free.",
    synopsis:
      "Read Berserk online free — the complete manga in high-quality black & white. Follow Guts, the Black Swordsman, and his brutal quest for revenge against Griffith and the God Hand in Kentaro Miura's genre-defining dark fantasy epic. No official full-color edition of Berserk exists, so every chapter is hosted here in black & white, clearly labeled — a fast, mobile-friendly reader with pinch-to-zoom on every page. No signup, no paywall.",
    keywords: [
      "berserk manga online free",
      "read berserk manga",
      "berserk manga black and white",
      "berserk full manga",
      "berserk guts manga",
    ],
    accent: "#8b0000",
    mark: "⚔️",
    totalChapters: 374,
  },
  {
    slug: "dr-stone",
    color: "none",
    colorNote: "Complete series in black & white — free to read",
    title: "Dr. Stone",
    nativeTitle: "ドクターストーン",
    altTitles: ["Doctor Stone", "Dr Stone Manga"],
    author: "Riichiro Inagaki",
    publisher: "Shueisha",
    genres: ["Adventure", "Sci-Fi", "Comedy", "Shounen"],
    status: "live",
    unit: "chapter",
    year: 2017,
    imageBase: DR_STONE_IMAGE_BASE,
    tagline:
      "Riichiro Inagaki & Boichi's science-adventure epic — the complete manga in HD black & white, free.",
    synopsis:
      "Read Dr. Stone online free — the complete manga in high-quality black & white. After humanity is turned to stone, genius Senku Ishigami wakes thousands of years later and sets out to rebuild civilization from zero with the power of science. No official full-color edition exists, so every chapter of Riichiro Inagaki and Boichi's hit is hosted here in black & white, clearly labeled. Fast, mobile-friendly reader with pinch-to-zoom — no signup, no paywall.",
    keywords: [
      "dr stone manga online free",
      "read dr stone manga",
      "dr stone manga black and white",
      "dr stone full manga",
      "senku dr stone manga",
    ],
    accent: "#27ae60",
    mark: "🧪",
    totalChapters: 232,
  },
  {
    slug: "mob-psycho-100",
    color: "none",
    colorNote: "Complete series in black & white — free to read",
    title: "Mob Psycho 100",
    nativeTitle: "モブサイコ100",
    altTitles: ["Mob Psycho", "Mob Psycho 100 Manga"],
    author: "ONE",
    publisher: "Shogakukan",
    genres: ["Action", "Comedy", "Supernatural", "Slice of Life"],
    status: "live",
    unit: "chapter",
    year: 2012,
    imageBase: MOB_PSYCHO_100_IMAGE_BASE,
    tagline:
      "ONE's psychic coming-of-age comedy — the complete manga in HD black & white, free.",
    synopsis:
      "Read Mob Psycho 100 online free — the complete manga in high-quality black & white. Shigeo \"Mob\" Kageyama is an ordinary middle-schooler with overwhelming psychic power he'd rather keep bottled up — until his emotions hit 100%. From ONE, the creator of One-Punch Man. No official full-color edition exists, so every chapter is hosted here in black & white, clearly labeled. Fast, mobile-friendly reader with pinch-to-zoom — no signup, no paywall.",
    keywords: [
      "mob psycho 100 manga online free",
      "read mob psycho 100 manga",
      "mob psycho 100 manga black and white",
      "mob psycho full manga",
      "mob psycho 100 manga ONE",
    ],
    accent: "#3867d6",
    mark: "💯",
    totalChapters: 101,
  },
  {
    slug: "blue-lock",
    color: "none",
    colorNote: "Black & white — free to read",
    title: "Blue Lock",
    nativeTitle: "ブルーロック",
    altTitles: ["Blue Lock Manga", "Burū Rokku"],
    author: "Muneyuki Kaneshiro",
    publisher: "Kodansha",
    genres: ["Sports", "Drama", "Thriller"],
    status: "live",
    unit: "chapter",
    year: 2018,
    imageBase: BLUE_LOCK_IMAGE_BASE,
    tagline:
      "Muneyuki Kaneshiro & Yusuke Nomura's striker survival-game — the manga in HD black & white, free.",
    synopsis:
      "Read Blue Lock online free in high-quality black & white. After Japan crashes out of the World Cup, 300 of the country's best high-school strikers are locked in a radical facility to forge the world's greatest egoist striker. No official full-color edition exists, so every chapter is hosted here in black & white, clearly labeled — fast, mobile-friendly reader with pinch-to-zoom. No signup, no paywall.",
    keywords: [
      "blue lock manga online free",
      "read blue lock manga",
      "blue lock manga black and white",
      "blue lock full manga",
      "blue lock isagi manga",
    ],
    accent: "#2d6cdf",
    mark: "⚽",
    totalChapters: 290,
  },
  {
    slug: "kaiju-no-8",
    color: "none",
    colorNote: "Complete run in black & white — free to read",
    title: "Kaiju No. 8",
    nativeTitle: "怪獣8号",
    altTitles: ["Kaiju No.8", "Monster #8", "Kaijuu 8-gou"],
    author: "Naoya Matsumoto",
    publisher: "Shueisha",
    genres: ["Action", "Sci-Fi", "Comedy"],
    status: "live",
    unit: "chapter",
    year: 2020,
    imageBase: KAIJU_NO_8_IMAGE_BASE,
    tagline:
      "Naoya Matsumoto's kaiju-hunting action-comedy — the manga in HD black & white, free.",
    synopsis:
      "Read Kaiju No. 8 online free in high-quality black & white. Kafka Hibino cleans up kaiju corpses for the Defense Force until he gains the power to become a kaiju himself — and vows to fight from the inside. No official full-color edition exists, so every chapter of Naoya Matsumoto's hit is hosted here in black & white, clearly labeled — fast, mobile-friendly reader with pinch-to-zoom. No signup, no paywall.",
    keywords: [
      "kaiju no 8 manga online free",
      "read kaiju no 8 manga",
      "kaiju no 8 manga black and white",
      "monster 8 manga",
      "kaiju no 8 full manga",
    ],
    accent: "#8e44ad",
    mark: "👹",
    totalChapters: 129,
  },
  {
    slug: "hells-paradise",
    color: "none",
    colorNote: "Complete series in black & white — free to read",
    title: "Hell's Paradise: Jigokuraku",
    nativeTitle: "地獄楽",
    altTitles: ["Hell's Paradise", "Jigokuraku", "Hells Paradise Manga"],
    author: "Yuji Kaku",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Dark Fantasy", "Historical"],
    status: "live",
    unit: "chapter",
    year: 2018,
    imageBase: HELLS_PARADISE_IMAGE_BASE,
    tagline:
      "Yuji Kaku's ninja-vs-immortals death-island epic — the complete manga in HD black & white, free.",
    synopsis:
      "Read Hell's Paradise: Jigokuraku online free — the complete manga in high-quality black & white. Gabimaru the Hollow, a death-row ninja who can't die, is offered a pardon if he retrieves the Elixir of Life from a mysterious island crawling with monsters. No official full-color edition exists, so every chapter of Yuji Kaku's series is hosted here in black & white, clearly labeled — fast, mobile-friendly reader with pinch-to-zoom. No signup, no paywall.",
    keywords: [
      "hells paradise manga online free",
      "read hells paradise manga",
      "jigokuraku manga black and white",
      "hells paradise full manga",
      "gabimaru hells paradise manga",
    ],
    accent: "#b03a5b",
    mark: "🗡️",
    totalChapters: 127,
  },
  {
    slug: "dandadan",
    color: "none",
    colorNote: "Black & white — free to read",
    title: "Dandadan",
    nativeTitle: "ダンダダン",
    altTitles: ["Dan Da Dan", "Dandadan Manga"],
    author: "Yukinobu Tatsu",
    publisher: "Shueisha",
    genres: ["Action", "Comedy", "Supernatural", "Sci-Fi"],
    status: "live",
    unit: "chapter",
    year: 2021,
    imageBase: DANDADAN_IMAGE_BASE,
    tagline:
      "Yukinobu Tatsu's aliens-vs-yokai supernatural romp — the manga in HD black & white, free.",
    synopsis:
      "Read Dandadan online free in high-quality black & white. Momo believes in ghosts, Okarun believes in aliens — and when both turn out to be real, the two are dragged into a chaotic, fast-drawn supernatural adventure. No official full-color edition exists, so every chapter of Yukinobu Tatsu's breakout hit is hosted here in black & white, clearly labeled — fast, mobile-friendly reader with pinch-to-zoom. No signup, no paywall.",
    keywords: [
      "dandadan manga online free",
      "read dandadan manga",
      "dandadan manga black and white",
      "dandadan full manga",
      "dan da dan manga",
    ],
    accent: "#7d5fff",
    mark: "👽",
    totalChapters: 198,
  },
  {
    // Franchise hub — groups the individual JoJo Part series into one landing
    // card. Its page renders the Parts as sections; the Part pages stay live at
    // their own URLs (already indexed), so no SEO is lost.
    slug: "jojos-bizarre-adventure",
    color: "full",
    title: "JoJo's Bizarre Adventure",
    nativeTitle: "ジョジョの奇妙な冒険",
    altTitles: ["JoJo", "JJBA", "JoJo no Kimyou na Bouken", "Colorized JoJo"],
    author: "Hirohiko Araki",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Supernatural"],
    status: "live",
    unit: "chapter",
    year: 1987,
    imageBase: "",
    tagline:
      "Hirohiko Araki's generational saga — every Part, digitally colorized in full HD.",
    synopsis:
      "Read JoJo's Bizarre Adventure in full color — every Part of Hirohiko Araki's genre-defining saga, digitally colored in high definition. From Jonathan Joestar and Dio Brando in Phantom Blood, through Joseph Joestar's Battle Tendency, Jotaro and the Stardust Crusaders, Diamond is Unbreakable, Golden Wind, Stone Ocean, Steel Ball Run and JoJolion, all the way to The JOJOLands — the whole bizarre bloodline of the Joestars and their Stands, in vivid color instead of black and white. Pick a Part below and start reading, free, on a fast mobile reader with pinch-to-zoom.",
    keywords: [
      "colorized jojo manga",
      "jojo colored manga",
      "jojo's bizarre adventure color manga",
      "read jojo in color",
      "jojo full color",
      "jojo bizarre adventure colored",
      "jojo manga online free",
    ],
    poster: "/covers/jojos-bizarre-adventure.png",
    posterPosition: "50% 18%",
    accent: "#b06be0",
    mark: "⭐",
    parts: [
      { slug: "jojo-no-kimyou-na-bouken-part-1-phantom-", title: "Part 1: Phantom Blood" },
      { slug: "jojo-no-kimyou-na-bouken-part-2-sentou-c", title: "Part 2: Battle Tendency" },
      { slug: "jojo-no-kimyou-na-bouken-part-3-stardust", title: "Part 3: Stardust Crusaders" },
      { slug: "jojo-no-kimyou-na-bouken-part-4-diamond-", title: "Part 4: Diamond is Unbreakable" },
      { slug: "jojo-no-kimyou-na-bouken-part-5-ougon-no", title: "Part 5: Golden Wind" },
      { slug: "jojo-no-kimyou-na-bouken-part-6-stone-oc", title: "Part 6: Stone Ocean" },
      { slug: "jojo-no-kimyou-na-bouken-part-7-steel-ba", title: "Part 7: Steel Ball Run" },
      { slug: "jojo-no-kimyou-na-bouken-part-8-jojolion", title: "Part 8: JoJolion" },
      { slug: "jojo-s-bizarre-adventure-part-9-the-jojo", title: "Part 9: The JOJOLands" },
    ],
  },
  {
    slug: "tokyo-ghoul",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Tokyo Ghoul",
    nativeTitle: "東京喰種",
    altTitles: ["Tokyo Guru", "Tokyo Ghoul Manga"],
    author: "Sui Ishida",
    publisher: "Shueisha",
    genres: ["Horror", "Dark Fantasy", "Psychological", "Action"],
    status: "live",
    unit: "chapter",
    year: 2011,
    imageBase: TOKYO_GHOUL_IMAGE_BASE,
    tagline:
      "Sui Ishida's Tokyo Ghoul — the complete manga in HD black & white, free.",
    synopsis:
      "Read Tokyo Ghoul online free — the complete manga in high-quality black & white. College student Ken Kaneki barely survives a date with a flesh-eating ghoul, only to be reborn as a half-ghoul forced to live between two worlds in Sui Ishida's haunting dark-fantasy tragedy. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["tokyo ghoul manga online free", "read tokyo ghoul manga", "tokyo ghoul manga black and white", "tokyo ghoul full manga", "tokyo ghoul manga free"],
    poster: "/covers/tokyo-ghoul.jpg",
    accent: "#8a0f1a",
    mark: "🩸",
    totalChapters: 143,
  },
  {
    slug: "tokyo-revengers",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Tokyo Revengers",
    nativeTitle: "東京卍リベンジャーズ",
    altTitles: ["Tokyo Manji Revengers", "Tokyo Revengers Manga"],
    author: "Ken Wakui",
    publisher: "Kodansha",
    genres: ["Action", "Drama", "Delinquents", "Time Travel"],
    status: "coming-soon",
    unit: "chapter",
    year: 2017,
    imageBase: TOKYO_REVENGERS_IMAGE_BASE,
    tagline:
      "Ken Wakui's Tokyo Revengers — the complete manga in HD black & white, free.",
    synopsis:
      "Read Tokyo Revengers online free — the complete manga in high-quality black & white. Failure Takemichi Hanagaki discovers he can travel twelve years into the past and sets out to rewrite the future of the gang war that killed the only girl who ever loved him, in Ken Wakui's time-leaping delinquent saga. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["tokyo revengers manga online free", "read tokyo revengers manga", "tokyo revengers manga black and white", "tokyo revengers full manga", "tokyo revengers manga free"],
    poster: "/covers/tokyo-revengers.jpg",
    accent: "#123a63",
    mark: "🕰️",
    totalChapters: 278,
  },
  {
    slug: "fire-force",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Fire Force",
    nativeTitle: "炎炎ノ消防隊",
    altTitles: ["Enen no Shouboutai", "Fire Force Manga"],
    author: "Atsushi Ohkubo",
    publisher: "Kodansha",
    genres: ["Action", "Supernatural", "Sci-Fi"],
    status: "live",
    unit: "chapter",
    year: 2015,
    imageBase: FIRE_FORCE_IMAGE_BASE,
    tagline:
      "Atsushi Ohkubo's Fire Force — the complete manga in HD black & white, free.",
    synopsis:
      "Read Fire Force online free — the complete manga in high-quality black & white. In a world where people spontaneously combust into rampaging Infernals, third-generation pyrokinetic Shinra Kusakabe joins Special Fire Force Company 8 to burn away a burning conspiracy, in Atsushi Ohkubo's blazing action epic. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["fire force manga online free", "read fire force manga", "fire force manga black and white", "fire force full manga", "fire force manga free"],
    poster: "/covers/fire-force.jpg",
    accent: "#d94f1a",
    mark: "🔥",
    totalChapters: 304,
  },
  {
    slug: "vinland-saga",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Vinland Saga",
    nativeTitle: "ヴィンランド・サガ",
    altTitles: ["Vinland Saga Manga"],
    author: "Makoto Yukimura",
    publisher: "Kodansha",
    genres: ["Action", "Adventure", "Historical", "Drama"],
    status: "live",
    unit: "chapter",
    year: 2005,
    imageBase: VINLAND_SAGA_IMAGE_BASE,
    tagline:
      "Makoto Yukimura's Vinland Saga — the complete manga in HD black & white, free.",
    synopsis:
      "Read Vinland Saga online free — the complete manga in high-quality black & white. Young Thorfinn joins a band of Viking mercenaries to avenge his father, then must learn what it means to be a true warrior in a land beyond war, in Makoto Yukimura's sweeping historical epic of Vikings and vengeance. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["vinland saga manga online free", "read vinland saga manga", "vinland saga manga black and white", "vinland saga full manga", "vinland saga manga free"],
    poster: "/covers/vinland-saga.jpg",
    accent: "#3a5a40",
    mark: "⚔️",
    totalChapters: 220,
  },
  {
    slug: "the-promised-neverland",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "The Promised Neverland",
    nativeTitle: "約束のネバーランド",
    altTitles: ["Yakusoku no Neverland", "TPN", "The Promised Neverland Manga"],
    author: "Kaiu Shirai",
    publisher: "Shueisha",
    genres: ["Horror", "Mystery", "Thriller", "Sci-Fi"],
    status: "live",
    unit: "chapter",
    year: 2016,
    imageBase: THE_PROMISED_NEVERLAND_IMAGE_BASE,
    tagline:
      "Kaiu Shirai's The Promised Neverland — the complete manga in HD black & white, free.",
    synopsis:
      "Read The Promised Neverland online free — the complete manga in high-quality black & white. The gifted orphans of Grace Field House live an idyllic life until Emma and Norman discover the horrifying truth behind the walls and plot a desperate escape, in Kaiu Shirai and Posuka Demizu's pulse-pounding thriller. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["the promised neverland manga online free", "read the promised neverland manga", "the promised neverland manga black and white", "the promised neverland full manga", "the promised neverland manga free"],
    poster: "/covers/the-promised-neverland.jpg",
    accent: "#1f6f6f",
    mark: "🌱",
    totalChapters: 181,
  },
  {
    slug: "fairy-tail",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Fairy Tail",
    nativeTitle: "フェアリーテイル",
    altTitles: ["Fairy Tail Manga"],
    author: "Hiro Mashima",
    publisher: "Kodansha",
    genres: ["Action", "Adventure", "Fantasy"],
    status: "live",
    unit: "chapter",
    year: 2006,
    imageBase: FAIRY_TAIL_IMAGE_BASE,
    tagline:
      "Hiro Mashima's Fairy Tail — the complete manga in HD black & white, free.",
    synopsis:
      "Read Fairy Tail online free — the complete manga in high-quality black & white. Celestial wizard Lucy joins the rowdiest guild in the kingdom and teams with fire-eating dragon slayer Natsu for a magic-blasting adventure, in Hiro Mashima's beloved fantasy about friendship and found family. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["fairy tail manga online free", "read fairy tail manga", "fairy tail manga black and white", "fairy tail full manga", "fairy tail manga free"],
    poster: "/covers/fairy-tail.jpg",
    accent: "#d81e5b",
    mark: "🧚",
    totalChapters: 545,
  },
  {
    slug: "yu-yu-hakusho",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Yu Yu Hakusho",
    nativeTitle: "幽☆遊☆白書",
    altTitles: ["Yuyu Hakusho", "Ghost Files", "Yu Yu Hakusho Manga"],
    author: "Yoshihiro Togashi",
    publisher: "Shueisha",
    genres: ["Action", "Supernatural", "Martial Arts"],
    status: "live",
    unit: "chapter",
    year: 1990,
    imageBase: YU_YU_HAKUSHO_IMAGE_BASE,
    tagline:
      "Yoshihiro Togashi's Yu Yu Hakusho — the complete manga in HD black & white, free.",
    synopsis:
      "Read Yu Yu Hakusho online free — the complete manga in high-quality black & white. Teenage delinquent Yusuke Urameshi dies saving a child, earns a second chance as a Spirit Detective, and battles demons in brutal tournaments, in Yoshihiro Togashi's genre-defining supernatural shonen. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["yu yu hakusho manga online free", "read yu yu hakusho manga", "yu yu hakusho manga black and white", "yu yu hakusho full manga", "yu yu hakusho manga free"],
    poster: "/covers/yu-yu-hakusho.jpg",
    accent: "#2e5e8c",
    mark: "👻",
    totalChapters: 175,
  },
  {
    slug: "blue-exorcist",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Blue Exorcist",
    nativeTitle: "青の祓魔師",
    altTitles: ["Ao no Exorcist", "Blue Exorcist Manga"],
    author: "Kazue Kato",
    publisher: "Shueisha",
    genres: ["Action", "Supernatural", "Fantasy"],
    status: "live",
    unit: "chapter",
    year: 2009,
    imageBase: BLUE_EXORCIST_IMAGE_BASE,
    tagline:
      "Kazue Kato's Blue Exorcist — the complete manga in HD black & white, free.",
    synopsis:
      "Read Blue Exorcist online free — the complete manga in high-quality black & white. Rin Okumura learns he is the son of Satan and enrolls at True Cross Academy to become an exorcist strong enough to defeat his own father, in Kazue Kato's stylish demon-hunting adventure. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["blue exorcist manga online free", "read blue exorcist manga", "blue exorcist manga black and white", "blue exorcist full manga", "blue exorcist manga free"],
    poster: "/covers/blue-exorcist.jpg",
    accent: "#1e5fd8",
    mark: "🔵",
    totalChapters: 149,
  },
  {
    slug: "food-wars",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Food Wars!",
    nativeTitle: "食戟のソーマ",
    altTitles: ["Shokugeki no Soma", "Food Wars Manga"],
    author: "Yuto Tsukuda",
    publisher: "Shueisha",
    genres: ["Cooking", "Comedy", "Ecchi", "Drama"],
    status: "live",
    unit: "chapter",
    year: 2012,
    imageBase: FOOD_WARS_IMAGE_BASE,
    tagline:
      "Yuto Tsukuda's Food Wars — the complete manga in HD black & white, free.",
    synopsis:
      "Read Food Wars! online free — the complete manga in high-quality black & white. Diner cook Soma Yukihira enrolls in an elite culinary academy where students duel in high-stakes cooking battles, in Yuto Tsukuda and Shun Saeki's mouth-watering, over-the-top shonen about food. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["food wars manga online free", "read food wars manga", "food wars manga black and white", "food wars full manga", "food wars manga free"],
    poster: "/covers/food-wars.jpg",
    accent: "#e0a11a",
    mark: "🍳",
    totalChapters: 315,
  },
  {
    slug: "seven-deadly-sins",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "The Seven Deadly Sins",
    nativeTitle: "七つの大罪",
    altTitles: ["Nanatsu no Taizai", "Seven Deadly Sins Manga"],
    author: "Nakaba Suzuki",
    publisher: "Kodansha",
    genres: ["Action", "Adventure", "Fantasy"],
    status: "live",
    unit: "chapter",
    year: 2012,
    imageBase: SEVEN_DEADLY_SINS_IMAGE_BASE,
    tagline:
      "Nakaba Suzuki's The Seven Deadly Sins — the complete manga in HD black & white, free.",
    synopsis:
      "Read The Seven Deadly Sins online free — the complete manga in high-quality black & white. Princess Elizabeth seeks out the Seven Deadly Sins, a disbanded band of legendary knights branded as traitors, to reclaim her kingdom from a corrupt order, in Nakaba Suzuki's action-packed fantasy. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["the seven deadly sins manga online free", "read the seven deadly sins manga", "the seven deadly sins manga black and white", "the seven deadly sins full manga", "the seven deadly sins manga free"],
    poster: "/covers/seven-deadly-sins.jpg",
    accent: "#6a2ea0",
    mark: "🐗",
    totalChapters: 346,
  },
  {
    slug: "world-trigger",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "World Trigger",
    nativeTitle: "ワールドトリガー",
    altTitles: ["World Trigger Manga"],
    author: "Daisuke Ashihara",
    publisher: "Shueisha",
    genres: ["Action", "Sci-Fi", "Strategy"],
    status: "live",
    unit: "chapter",
    year: 2013,
    imageBase: WORLD_TRIGGER_IMAGE_BASE,
    tagline:
      "Daisuke Ashihara's World Trigger — the complete manga in HD black & white, free.",
    synopsis:
      "Read World Trigger online free — the complete manga in high-quality black & white. When gate-opening aliens called Neighbors invade, the elite Border defense agency fights back with Trigger weapons — and mild newcomer Osamu and mysterious transfer Yuma rise through the ranks, in Daisuke Ashihara's tactical sci-fi. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["world trigger manga online free", "read world trigger manga", "world trigger manga black and white", "world trigger full manga", "world trigger manga free"],
    poster: "/covers/world-trigger.jpg",
    accent: "#1a8ca0",
    mark: "🛡️",
    totalChapters: 262,
  },
  {
    slug: "mashle",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Mashle: Magic and Muscles",
    nativeTitle: "マッシュル",
    altTitles: ["Mashle Manga", "Magic and Muscles"],
    author: "Hajime Komoto",
    publisher: "Shueisha",
    genres: ["Action", "Comedy", "Fantasy", "Parody"],
    status: "live",
    unit: "chapter",
    year: 2020,
    imageBase: MASHLE_IMAGE_BASE,
    tagline:
      "Hajime Komoto's Mashle: Magic and Muscles — the complete manga in HD black & white, free.",
    synopsis:
      "Read Mashle: Magic and Muscles online free — the complete manga in high-quality black & white. In a world ruled by magic, muscle-bound Mash Burnedead has none — so he punches his way through a wizard academy that would expel (or kill) him for it, in Hajime Komoto's gut-busting action parody. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["mashle: magic and muscles manga online free", "read mashle: magic and muscles manga", "mashle: magic and muscles manga black and white", "mashle: magic and muscles full manga", "mashle: magic and muscles manga free"],
    poster: "/covers/mashle.jpg",
    accent: "#3a3a3a",
    mark: "💪",
    totalChapters: 162,
  },
  {
    slug: "20th-century-boys",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "20th Century Boys",
    nativeTitle: "20世紀少年",
    altTitles: ["20th Century Boys Manga", "Nijusseiki Shonen"],
    author: "Naoki Urasawa",
    publisher: "Shogakukan",
    genres: ["Mystery", "Thriller", "Sci-Fi", "Drama"],
    status: "coming-soon",
    unit: "chapter",
    year: 1999,
    imageBase: N20TH_CENTURY_BOYS_IMAGE_BASE,
    tagline:
      "Naoki Urasawa's 20th Century Boys — the complete manga in HD black & white, free.",
    synopsis:
      "Read 20th Century Boys online free — the complete manga in high-quality black & white. A group of childhood friends realize a doomsday cult is enacting the fantasy apocalypse they scribbled as kids — and only they can stop it, in Naoki Urasawa's sprawling, masterful conspiracy thriller. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["20th century boys manga online free", "read 20th century boys manga", "20th century boys manga black and white", "20th century boys full manga", "20th century boys manga free"],
    poster: "/covers/20th-century-boys.jpg",
    accent: "#7a5a2e",
    mark: "🎸",
    totalChapters: 249,
  },
  {
    slug: "solo-leveling",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Solo Leveling",
    nativeTitle: "나 혼자만 레벨업",
    altTitles: ["Na Honjaman Level Up", "Only I Level Up", "Solo Leveling Manhwa"],
    author: "Chugong",
    publisher: "D&C Media",
    genres: ["Action", "Fantasy", "Adventure"],
    status: "live",
    unit: "chapter",
    year: 2018,
    imageBase: SOLO_LEVELING_IMAGE_BASE,
    tagline:
      "Chugong's Solo Leveling — the complete manga in HD black & white, free.",
    synopsis:
      "Read Solo Leveling online free — the complete manga in high-quality black & white. Weakest-hunter Sung Jinwoo gains a mysterious leveling system after a deadly dungeon and rises from the bottom to the most powerful hunter alive, in Chugong's record-breaking action fantasy. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["solo leveling manga online free", "read solo leveling manga", "solo leveling manga black and white", "solo leveling full manga", "solo leveling manga free"],
    poster: "/covers/solo-leveling.jpg",
    accent: "#5b21b6",
    mark: "⚔️",
    totalChapters: 201,
  },
  {
    slug: "haikyu",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Haikyu!!",
    nativeTitle: "ハイキュー!!",
    altTitles: ["Haikyuu", "Haikyu Manga"],
    author: "Haruichi Furudate",
    publisher: "Shueisha",
    genres: ["Sports", "Comedy", "Drama"],
    status: "coming-soon",
    unit: "chapter",
    year: 2012,
    imageBase: HAIKYU_IMAGE_BASE,
    tagline:
      "Haruichi Furudate's Haikyu — the complete manga in HD black & white, free.",
    synopsis:
      "Read Haikyu!! online free — the complete manga in high-quality black & white. Short but sky-hungry Shoyo Hinata joins Karasuno High's volleyball team and forms an explosive partnership with prodigy setter Kageyama, in Haruichi Furudate's beloved, heart-pounding sports manga. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["haikyu manga online free", "read haikyu manga", "haikyu manga black and white", "haikyu full manga", "haikyu manga free"],
    poster: "/covers/haikyu.jpg",
    accent: "#e07a1a",
    mark: "🏐",
    totalChapters: 402,
  },
  {
    slug: "kingdom",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Kingdom",
    nativeTitle: "キングダム",
    altTitles: ["Kingudamu", "Kingdom Manga"],
    author: "Yasuhisa Hara",
    publisher: "Shueisha",
    genres: ["Action", "Historical", "Military", "Drama"],
    status: "coming-soon",
    unit: "chapter",
    year: 2006,
    imageBase: KINGDOM_IMAGE_BASE,
    tagline:
      "Yasuhisa Hara's Kingdom — the complete manga in HD black & white, free.",
    synopsis:
      "Read Kingdom online free — the complete manga in high-quality black & white. War-orphan Xin fights to become the greatest general under heaven amid the chaos of China's Warring States period, in Yasuhisa Hara's sweeping, battle-hardened historical epic. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["kingdom manga online free", "read kingdom manga", "kingdom manga black and white", "kingdom full manga", "kingdom manga free"],
    poster: "/covers/kingdom.jpg",
    accent: "#8a1c1c",
    mark: "🏇",
    totalChapters: 883,
  },
  {
    slug: "oshi-no-ko",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Oshi no Ko",
    nativeTitle: "【推しの子】",
    altTitles: ["My Star", "Oshi no Ko Manga"],
    author: "Aka Akasaka",
    publisher: "Shueisha",
    genres: ["Drama", "Mystery", "Psychological"],
    status: "coming-soon",
    unit: "chapter",
    year: 2020,
    imageBase: OSHI_NO_KO_IMAGE_BASE,
    tagline:
      "Aka Akasaka's Oshi no Ko — the complete manga in HD black & white, free.",
    synopsis:
      "Read Oshi no Ko online free — the complete manga in high-quality black & white. A country doctor is reborn as the child of the idol he adored — and grows up chasing the dark truth behind her murder through the glittering, ruthless world of showbiz, in Aka Akasaka and Mengo Yokoyari's gripping drama. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["oshi no ko manga online free", "read oshi no ko manga", "oshi no ko manga black and white", "oshi no ko full manga", "oshi no ko manga free"],
    poster: "/covers/oshi-no-ko.jpg",
    accent: "#e11d74",
    mark: "⭐",
    totalChapters: 166,
  },
  {
    slug: "black-butler",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Black Butler",
    nativeTitle: "黒執事",
    altTitles: ["Kuroshitsuji", "Black Butler Manga"],
    author: "Yana Toboso",
    publisher: "Square Enix",
    genres: ["Dark Fantasy", "Mystery", "Historical", "Comedy"],
    status: "coming-soon",
    unit: "chapter",
    year: 2006,
    imageBase: BLACK_BUTLER_IMAGE_BASE,
    tagline:
      "Yana Toboso's Black Butler — the complete manga in HD black & white, free.",
    synopsis:
      "Read Black Butler online free — the complete manga in high-quality black & white. Twelve-year-old earl Ciel Phantomhive commands a demon butler bound by a Faustian contract to serve him and hunt his parents' killers in Victorian London, in Yana Toboso's elegant, macabre gothic tale. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["black butler manga online free", "read black butler manga", "black butler manga black and white", "black butler full manga", "black butler manga free"],
    poster: "/covers/black-butler.jpg",
    accent: "#1a1a2e",
    mark: "🎩",
    totalChapters: 215,
  },
  {
    slug: "soul-eater",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Soul Eater",
    nativeTitle: "ソウルイーター",
    altTitles: ["Soul Eater Manga"],
    author: "Atsushi Ohkubo",
    publisher: "Square Enix",
    genres: ["Action", "Supernatural", "Comedy", "Dark Fantasy"],
    status: "coming-soon",
    unit: "chapter",
    year: 2004,
    imageBase: SOUL_EATER_IMAGE_BASE,
    tagline:
      "Atsushi Ohkubo's Soul Eater — the complete manga in HD black & white, free.",
    synopsis:
      "Read Soul Eater online free — the complete manga in high-quality black & white. At Death Weapon Meister Academy, students pair as weapons and wielders to collect corrupt souls and prevent the resurrection of madness itself, in Atsushi Ohkubo's stylish, off-kilter action comedy. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["soul eater manga online free", "read soul eater manga", "soul eater manga black and white", "soul eater full manga", "soul eater manga free"],
    poster: "/covers/soul-eater.jpg",
    accent: "#2e2e5e",
    mark: "💀",
    totalChapters: 113,
  },
  {
    slug: "noragami",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Noragami",
    nativeTitle: "ノラガミ",
    altTitles: ["Noragami Manga", "Stray God"],
    author: "Adachitoka",
    publisher: "Kodansha",
    genres: ["Action", "Supernatural", "Comedy", "Drama"],
    status: "coming-soon",
    unit: "chapter",
    year: 2010,
    imageBase: NORAGAMI_IMAGE_BASE,
    tagline:
      "Adachitoka's Noragami — the complete manga in HD black & white, free.",
    synopsis:
      "Read Noragami online free — the complete manga in high-quality black & white. Minor, shrine-less god Yato does odd jobs for five yen apiece while dreaming of worshippers — until a schoolgirl's sacrifice ties their fates together, in Adachitoka's witty, soulful supernatural adventure. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["noragami manga online free", "read noragami manga", "noragami manga black and white", "noragami full manga", "noragami manga free"],
    poster: "/covers/noragami.jpg",
    accent: "#2a7a8c",
    mark: "⛩️",
    totalChapters: 110,
  },
  {
    slug: "goblin-slayer",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Goblin Slayer",
    nativeTitle: "ゴブリンスレイヤー",
    altTitles: ["Goblin Slayer Manga"],
    author: "Kumo Kagyu",
    publisher: "Square Enix",
    genres: ["Dark Fantasy", "Action", "Adventure"],
    status: "coming-soon",
    unit: "chapter",
    year: 2016,
    imageBase: GOBLIN_SLAYER_IMAGE_BASE,
    tagline:
      "Kumo Kagyu's Goblin Slayer — the complete manga in HD black & white, free.",
    synopsis:
      "Read Goblin Slayer online free — the complete manga in high-quality black & white. A grim, single-minded adventurer known only as Goblin Slayer takes only one kind of quest — exterminating the goblins everyone else ignores — in Kumo Kagyu and Kousuke Kurose's brutal dark-fantasy manga. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["goblin slayer manga online free", "read goblin slayer manga", "goblin slayer manga black and white", "goblin slayer full manga", "goblin slayer manga free"],
    poster: "/covers/goblin-slayer.jpg",
    accent: "#5a5a2e",
    mark: "🗡️",
    totalChapters: 100,
  },
  {
    slug: "goodnight-punpun",
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Goodnight Punpun",
    nativeTitle: "おやすみプンプン",
    altTitles: ["Oyasumi Punpun", "Goodnight Punpun Manga"],
    author: "Inio Asano",
    publisher: "Shogakukan",
    genres: ["Drama", "Psychological", "Slice of Life", "Coming of Age"],
    status: "coming-soon",
    unit: "chapter",
    year: 2007,
    imageBase: GOODNIGHT_PUNPUN_IMAGE_BASE,
    tagline:
      "Inio Asano's Goodnight Punpun — the complete manga in HD black & white, free.",
    synopsis:
      "Read Goodnight Punpun online free — the complete manga in high-quality black & white. Punpun Onodera — drawn as a little bird — grows from a hopeful boy into a troubled young man across love, loss, and quiet despair, in Inio Asano's unflinching, unforgettable coming-of-age masterwork. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["goodnight punpun manga online free", "read goodnight punpun manga", "goodnight punpun manga black and white", "goodnight punpun full manga", "goodnight punpun manga free"],
    poster: "/covers/goodnight-punpun.jpg",
    accent: "#4a4a4a",
    mark: "🐤",
    totalChapters: 147,
  },
];

// Auto-registered series (added by tools/register_series.py). Hand-authored
// entries above always win on slug conflicts; auto entries only add new slugs.
const AUTO_MANGAS = autoSeriesRaw as Manga[];
const _handSlugs = new Set(HAND_MANGAS.map((m) => m.slug));
export const MANGAS: Manga[] = [
  ...HAND_MANGAS,
  ...AUTO_MANGAS.filter((m) => !_handSlugs.has(m.slug)),
].filter((m) => !m.hidden); // `hidden` series stay in the source data but leave the site entirely.

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

// Slugs that belong to a franchise hub (e.g. JoJo Parts). These are hidden from
// the landing/footer grids so the hub's single card represents them — but their
// individual pages stay live and indexed (they are NOT removed from MANGAS).
const _partSlugs = new Set<string>();
for (const m of MANGAS) if (m.parts) for (const p of m.parts) _partSlugs.add(p.slug);
// The duplicate romaji Part 9 entry the hub doesn't feature — hide it too.
_partSlugs.add("jojo-no-kimyou-na-bouken-dai-9-bu-the-jo");

export function isPartSlug(slug: string): boolean {
  return _partSlugs.has(slug);
}

/** Live series shown on the landing/footer grids: excludes franchise Part
 *  sub-series (represented by their hub card instead). */
export function topLevelLiveMangas(): Manga[] {
  return MANGAS.filter((m) => m.status === "live" && !_partSlugs.has(m.slug));
}
