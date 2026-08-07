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
  /** Global-fame rank (1 = most famous). Drives hub ordering; lower sorts first. */
  popularity?: number;
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

const OP_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/op-color-pages@adfcd0edba976af3e1e6da6d3d1ece5919b429be/pages";

const BLEACH_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/bleach-color-pages@96ecf918579e1628ebcf1930bcc41e974f037bec/pages";
const NARUTO_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/naruto-color-pages@c73b899122fa02a02fe4912ec7b3dcc52bf6ae2f/pages";
const CHAINSAW_MAN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/chainsaw-man-color-pages@6eb27077c6e16c9426f1f034dc3d97b31a25d0eb/pages";
const HUNTER_X_HUNTER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/hunter-x-hunter-color-pages@c5573ed36aef1ba6ca54a3399c9602bb886defaf/pages";
const DRAGON_BALL_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/dragon-ball-color-pages@73303cc360da3f338a7175fc954dadd9530f8926/pages";
const KAGUYA_SAMA_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/kaguya-sama-color-pages@01ab0fcff6ba764a192809f0e07b7668074d6f1f/pages";
const AKIRA_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/akira-color-pages@e1a39f64cc309af0d63a3974e72a84e8276fa9ad/pages";
const MY_HERO_ACADEMIA_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/my-hero-academia-color-pages@099535ebeea799cd517ae47dac3c4b690fd9dfb6/pages";
const YU_GI_OH_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/yu-gi-oh-color-pages@e457545b3a9480c7b34eabf5c21fbf928a468d85/pages";
const GOLDEN_KAMUY_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/golden-kamuy-color-pages@b81c5602f678638c1811504277d52c460d7e87e8/pages";
const HOSHIN_ENGI_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/hoshin-engi-color-pages@902761c9550208afb1de1743e8f91546d163ebd0/pages";
const DEMON_SLAYER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/demon-slayer-color-pages@734bd93a91dd6b5cd8322632b8e6fe2a24495ee2/pages";
const DEATH_NOTE_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/death-note-color-pages@eeec1f92d5edca9662420784e79b06c75031b54d/pages";
const RUROUNI_KENSHIN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/rurouni-kenshin-color-pages@ee8e87314e75cdf123b2cc9b1271804e5e4f68f0/pages";
const ATTACK_ON_TITAN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/attack-on-titan-color-pages@75af8ad37fc0e0a5335f7a565422165216421b57/pages";
const JUJUTSU_KAISEN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/jujutsu-kaisen-color-pages@a830ecbb20b6ea5866cb9a32de833e6949fb1bf2/pages";
const FULLMETAL_ALCHEMIST_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/fullmetal-alchemist-color-pages@66b055f5792eb0445d4a1399bcc0b91d957c62d2/pages";
const BERSERK_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/berserk-color-pages@507133bdbf774b16ee44030c34eb3c6dc69dcfe7/pages";
const MOB_PSYCHO_100_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/mob-psycho-100-color-pages@bb8e841fa93c34127a64be8f9e5e750a94fc4207/pages";
const DR_STONE_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/dr-stone-color-pages@60069ceec68740fce3c4cf930972c93d3a0ae461/pages";
const BLACK_CLOVER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/black-clover-color-pages@704f558d49750d19fa73eb3c937ba7022ff60a08/pages";
const BLUE_LOCK_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/blue-lock-color-pages@b5ec6fdbfb04e8a6a0e45c3d11d505e051a23b02/pages";
const KAIJU_NO_8_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/kaiju-no-8-color-pages@40d409dd29495fed3e0398c6fbbafb616b9384b3/pages";
const HELLS_PARADISE_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/hells-paradise-color-pages@1e7c33b2ca36ba2d0e8098db25ef93ec24eb170d/pages";
const DANDADAN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/dandadan-color-pages@ccba2e79d0d826b565a34b1a91a915acadb5f1f4/pages";

const TOKYO_GHOUL_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/tokyo-ghoul-color-pages@757c6b882385b52e02e9c154fdbf0f3fa9e6c067/pages";
const TOKYO_REVENGERS_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/tokyo-revengers-color-pages@c4eddf52c09ad7e6cc8d0be0cbdd54dbfeba8435/pages";
const FIRE_FORCE_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/fire-force-color-pages@030a1faad9402701f27e8b7bebdbaa3585627427/pages";
const VINLAND_SAGA_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/vinland-saga-color-pages@d899886b3219258d31806e21ea75725b2f0ba36e/pages";
const THE_PROMISED_NEVERLAND_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/the-promised-neverland-color-pages@d3f6755aaa62a3166bed0185e42956a0d5b134b9/pages";
const FAIRY_TAIL_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/fairy-tail-color-pages@3a64b6a62e80d3d7956459dc6d272fad93d980a3/pages";
const YU_YU_HAKUSHO_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/yu-yu-hakusho-color-pages@b94b9a48b5989ccb81d8e2a1a3cdd7751fbad5a0/pages";
const BLUE_EXORCIST_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/blue-exorcist-color-pages@3297345d746cbcda9abb9ee5e3c90b913a98531c/pages";
const FOOD_WARS_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/food-wars-color-pages@45d20d977eb776a26b06946e755d578dfbf594b7/pages";
const SEVEN_DEADLY_SINS_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/seven-deadly-sins-color-pages@0992684cbe0796ff6b40b80168821e1d78085c6e/pages";
const WORLD_TRIGGER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/world-trigger-color-pages@e8fe27d49f84bdeff71eba7ee5d659964f0755c3/pages";
const MASHLE_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/mashle-color-pages@26f43424412d7fd2c1d60c86e4daee48b378688e/pages";
const N20TH_CENTURY_BOYS_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/20th-century-boys-color-pages@c0d92493afcfcd1df2fa6c1827dbfd0cc3cbe489/pages";
const SOLO_LEVELING_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/solo-leveling-color-pages@8fbdf1ff66b1c50277d96640ab9f23863e94616d/pages";
const HAIKYU_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/haikyu-official-color-archive-color-pages@1dbcbb09bee5fe46ea9d52cf028760ca9f1ac6be/pages";
const ONE_PUNCH_MAN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/one-punch-man-color-pages@8e09f612651d27c0eb26faff84691062b72fa0f5/pages";
const SPY_X_FAMILY_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/spy-x-family-color-pages@11634d21f66a2e851e687eeaaafb54eb69116694/pages";
const PARASYTE_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/parasyte-full-color-archive-color-pages@fe1545cb03508ddb66b0133e0f65101474a3f002/pages";
const DARLING_IN_THE_FRANXX_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/darling-in-the-franxx-fan-color-archive-color-pages@a9620dc3bd59c8cc6d5a47a26e2beaa4fc58cc54/pages";
const FRIEREN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/frieren-color-pages@91c9a48e3fab0df74217f0095d96374b98074ce2/pages";
const GINTAMA_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/gintama-color-pages@9e16bb9b8f70f5b34349f3d604d38c04fe03826c/pages";
const MONSTER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/monster-color-pages@ac795cbca48c239b759ed874f47df1aa9ba59d76/pages";
const VAGABOND_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/vagabond-color-pages@8ce29de974b139eea00b00acad19cfa636e10dcc/pages";
const SLAM_DUNK_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/slam-dunk-color-pages@ac6a1e2653f7821717891516db079b2d9f80f405/pages";
const SAKAMOTO_DAYS_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/sakamoto-days-color-pages@889883565be752774059cfb218f83c20f096ed69/pages";
const KOMI_CANT_COMMUNICATE_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/komi-cant-communicate-color-pages@4bc0fb37e1ed738457d0c5cea382c7ad6f873547/pages";
const ASSASSINATION_CLASSROOM_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/assassination-classroom-color-pages@d2b1c5150a442026371f42f97d4d9bd99195ecf5/pages";
const KAGURABACHI_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/kagurabachi-color-pages@e73408e0939095aef330c4cbad5365e02ba9ed73/pages";
const DETECTIVE_CONAN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/detective-conan-color-pages@34ac20595d25dcb188bb5c937be19d10e206d836/pages";
const DORAEMON_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/doraemon-color-pages@cb43647077cdb9f789f17bcb83f300a01d08ac53/pages";
const FIST_OF_THE_NORTH_STAR_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/fist-of-the-north-star-color-pages@5fd4a41865dbc8d5bf4e39277d985f8788b244a9/pages";
const SAILOR_MOON_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/sailor-moon-color-pages@ed7bd2cc8da95575a3268ff6d25c6090e8a3116a/pages";
const INUYASHA_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/inuyasha-color-pages@fa56b5dee016d43fdc41a6b0a68577923e65ba0d/pages";
const KINGDOM_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/kingdom-color-pages@0811fba98f13b187718412aa5484d9d37fc0e75e/pages";
const OSHI_NO_KO_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/oshi-no-ko-color-pages@5f5f0c1a1fa6b990e437046cb20b84cb4cebf8fb/pages";
const BLACK_BUTLER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/black-butler-color-pages@c72c4a0a42d81c7ed7b13aedb2aae2d65a0c3c35/pages";
const SOUL_EATER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/soul-eater-color-pages@ff26fc746624f84475f2b6299ed623589e2ac878/pages";
const NORAGAMI_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/noragami-color-pages@c6bc3223ce04da16eb275c29968fab3ab89ed5c9/pages";
const GOBLIN_SLAYER_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/goblin-slayer-color-pages@7441dac6ac217f5a14122d1b12c861ed53ec9b45/pages";
const GOODNIGHT_PUNPUN_IMAGE_BASE =
  "https://cdn.jsdelivr.net/gh/anon6968/goodnight-punpun-color-pages@00438ef8f228c86b8be132f4e82b1ae38e961731/pages";

const HAND_MANGAS: Manga[] = [
  {
    slug: "one-piece",
    popularity: 1,
    color: "partial",
    colorNote: "Official color throughout, with partial-color page sets in chapters 1024, 1031, 1040, 1043–1045, 1049–1050, 1053, 1055, 1057, 1066, 1091, and 1129",
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
      "Official digital color across 1,139 chapters, with 14 additional chapters carrying partial-color page sets.",
    synopsis:
      "Read the colorized One Piece manga online for free — 1,139 chapters of Eiichiro Oda's legendary series fully colored in high definition, plus 14 chapters with clearly labeled partial-color page sets. Follow Monkey D. Luffy and the Straw Hat Pirates from Romance Dawn and the East Blue through Alabasta, Enies Lobby, Marineford, Dressrosa, Wano and the latest arc. No signup or paywall, with pinch-to-zoom on every page.",
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
    totalChapters: 1153,
  },
  {
    slug: "naruto",
    popularity: 2,
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
    popularity: 7,
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
    popularity: 4,
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
    popularity: 8,
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
    popularity: 12,
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
    popularity: 5,
    color: "partial",
    colorNote: "Fan-colored chapters 63, 82, 91–93, 97–135, and 138–139 (including SCNK chapter 93); all other chapters remain HD black & white",
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
      "Hajime Isayama's titan epic with 46 verified fan-colored chapters in HD.",
    synopsis:
      "Read Attack on Titan (Shingeki no Kyojin) online free, with 46 verified fan-colored chapters — including SCNK's chapter 93 — and the complete 139-chapter story preserved in HD black & white everywhere color is not yet available. Follow Eren, Mikasa and Armin from the fall of Wall Maria through Marley and the Rumbling in a fast mobile reader with every chapter honestly labeled.",
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
    popularity: 13,
    color: "partial",
    colorNote: "Official-color chapters 2 and 16–362; chapters 1, 3–15, and 363–390 remain HD black & white",
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
      "Yoshihiro Togashi's adventure epic with chapters 2 and 16–362 in official full color.",
    synopsis:
      "Read Hunter × Hunter online free, with official-color chapter 2 and chapters 16–362, while chapters 1, 3–15, and 363–390 remain honestly labeled HD black & white. Follow Gon Freecss through the Hunter Exam, Yorknew City, Greed Island and the Chimera Ant war in a fast mobile reader with zoom on every page.",
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
    totalChapters: 390,
  },
  {
    slug: "dragon-ball",
    popularity: 3,
    color: "full",
    title: "Dragon Ball",
    nativeTitle: "ドラゴンボール",
    altTitles: [
      "Dragon Ball Color",
      "Colorized Dragon Ball",
      "Dragon Ball Full Color",
      "DB",
    ],
    author: "Akira Toriyama",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Comedy", "Martial Arts"],
    status: "live",
    unit: "chapter",
    year: 1984,
    imageBase: DRAGON_BALL_IMAGE_BASE,
    tagline:
      "Akira Toriyama's legendary adventure — in official full color, HD.",
    synopsis:
      "Read the colorized Dragon Ball manga online for free — Akira Toriyama's world-defining adventure in official full color instead of black and white. Follow Goku from his childhood search for the Dragon Balls through the Tenkaichi Budokai, the Saiyan, Frieza, Cell and Majin Buu sagas, digitally colored in high definition. No signup, a fast mobile-friendly reader with zoom on every page.",
    keywords: [
      "colorized dragon ball manga",
      "dragon ball color manga",
      "dragon ball colored manga",
      "read dragon ball in color",
      "dragon ball full color",
      "dragon ball manga online free",
      "dragon ball colored chapters",
    ],
    poster: "/covers/dragon-ball.png",
    posterPosition: "center",
    accent: "#f0872b",
    mark: "🐉",
    totalChapters: 519,
  },
  {
    slug: "kaguya-sama",
    popularity: 39,
    color: "full",
    title: "Kaguya-sama: Love Is War",
    nativeTitle: "かぐや様は告らせたい",
    altTitles: [
      "Kaguya-sama wa Kokurasetai",
      "Kaguya-sama Color",
      "Colorized Kaguya-sama",
    ],
    author: "Aka Akasaka",
    publisher: "Shueisha",
    genres: ["Romance", "Comedy", "Psychological"],
    status: "live",
    unit: "chapter",
    year: 2015,
    imageBase: KAGUYA_SAMA_IMAGE_BASE,
    tagline:
      "Aka Akasaka's battle-of-wits rom-com — in official full color, HD.",
    synopsis:
      "Read the colorized Kaguya-sama: Love Is War manga online for free — Aka Akasaka's genius rom-com in official full color instead of black and white. Student council president Miyuki Shirogane and vice-president Kaguya Shinomiya wage psychological warfare to make the other confess first, digitally colored in high definition. No signup, a fast mobile-friendly reader with zoom on every page.",
    keywords: [
      "colorized kaguya sama manga",
      "kaguya sama color manga",
      "kaguya sama colored manga",
      "read kaguya sama in color",
      "kaguya sama love is war full color",
      "kaguya sama manga online free",
    ],
    accent: "#c2274e",
    mark: "💘",
    totalChapters: 44,
  },
  {
    slug: "akira",
    popularity: 48,
    color: "full",
    title: "Akira",
    nativeTitle: "アキラ",
    altTitles: ["Akira Color", "Colorized Akira", "Akira Full Color Edition"],
    author: "Katsuhiro Otomo",
    publisher: "Kodansha",
    genres: ["Sci-Fi", "Action", "Cyberpunk", "Seinen"],
    status: "live",
    unit: "chapter",
    year: 1982,
    imageBase: AKIRA_IMAGE_BASE,
    tagline:
      "Katsuhiro Otomo's cyberpunk masterpiece — the official full-color edition, HD.",
    synopsis:
      "Read the colorized Akira manga online for free — Katsuhiro Otomo's legendary cyberpunk epic in the official full-color edition instead of black and white. Neo-Tokyo, Kaneda, Tetsuo and the psychic experiment that ends a city, digitally colored in high definition. No signup, a fast mobile-friendly reader with zoom on every page.",
    keywords: [
      "colorized akira manga",
      "akira color manga",
      "akira colored manga",
      "read akira in color",
      "akira full color edition",
      "akira manga online free",
    ],
    accent: "#d02a2a",
    mark: "🏍️",
    totalChapters: 38,
  },
  {
    slug: "yu-gi-oh",
    popularity: 21,
    color: "full",
    title: "Yu-Gi-Oh!",
    nativeTitle: "遊☆戯☆王",
    altTitles: ["Yugioh", "Yu Gi Oh Color", "Colorized Yu-Gi-Oh!"],
    author: "Kazuki Takahashi",
    publisher: "Shueisha",
    genres: ["Action", "Supernatural", "Games"],
    status: "live",
    unit: "chapter",
    year: 1996,
    imageBase: YU_GI_OH_IMAGE_BASE,
    tagline:
      "Kazuki Takahashi's dark game classic — in official full color, HD.",
    synopsis:
      "Read the colorized Yu-Gi-Oh! manga online for free — Kazuki Takahashi's classic in official full color instead of black and white. Yugi Mutou solves the Millennium Puzzle and the Pharaoh's dark games begin, digitally colored in high definition. No signup, a fast mobile-friendly reader with zoom on every page.",
    keywords: [
      "colorized yu gi oh manga",
      "yu gi oh color manga",
      "yu gi oh colored manga",
      "read yu gi oh in color",
      "yugioh full color",
      "yu gi oh manga online free",
    ],
    accent: "#7a3fb8",
    mark: "🎴",
    totalChapters: 42,
  },
  {
    slug: "golden-kamuy",
    popularity: 34,
    color: "full",
    title: "Golden Kamuy",
    nativeTitle: "ゴールデンカムイ",
    altTitles: [
      "Golden Kamuy Color",
      "Colorized Golden Kamuy",
      "Golden Kamuy Full Color",
    ],
    author: "Satoru Noda",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Historical", "Seinen"],
    status: "live",
    unit: "chapter",
    year: 2014,
    imageBase: GOLDEN_KAMUY_IMAGE_BASE,
    tagline:
      "Satoru Noda's Hokkaido survival epic — in official full color, HD.",
    synopsis:
      "Read the colorized Golden Kamuy manga online for free — Satoru Noda's award-winning survival adventure in official full color instead of black and white. Ex-soldier Sugimoto and the Ainu girl Asirpa hunt a hidden cache of Ainu gold across a snowbound Hokkaido, digitally colored in high definition. No signup, a fast mobile-friendly reader with zoom on every page.",
    keywords: [
      "colorized golden kamuy manga",
      "golden kamuy color manga",
      "golden kamuy colored manga",
      "read golden kamuy in color",
      "golden kamuy full color",
      "golden kamuy manga online free",
      "golden kamuy colored chapters",
    ],
    poster: "/covers/golden-kamuy.png",
    posterPosition: "center",
    accent: "#c8a24a",
    mark: "🐻",
    totalChapters: 10,
  },
  {
    slug: "hoshin-engi",
    popularity: 65,
    color: "full",
    title: "Hoshin Engi",
    nativeTitle: "封神演義",
    altTitles: [
      "Hoshin Engi Color",
      "Colorized Hoshin Engi",
      "Soul Hunter",
      "Houshin Engi",
    ],
    author: "Ryu Fujisaki",
    publisher: "Shueisha",
    genres: ["Action", "Adventure", "Fantasy"],
    status: "live",
    unit: "chapter",
    year: 1996,
    imageBase: HOSHIN_ENGI_IMAGE_BASE,
    tagline:
      "Ryu Fujisaki's Chinese-mythology epic — in official full color, HD.",
    synopsis:
      "Read the colorized Hoshin Engi manga online for free — Ryu Fujisaki's retelling of the Chinese classic Investiture of the Gods in official full color instead of black and white. Taikobo and his paope battle the sorceress Dakki and her wicked immortals to reshape a corrupt dynasty, digitally colored in high definition. No signup, a fast mobile-friendly reader with zoom on every page.",
    keywords: [
      "colorized hoshin engi manga",
      "hoshin engi color manga",
      "hoshin engi colored manga",
      "read hoshin engi in color",
      "hoshin engi full color",
      "soul hunter manga online free",
      "hoshin engi colored chapters",
    ],
    accent: "#b5642e",
    mark: "🏯",
    totalChapters: 46,
  },
  {
    slug: "chainsaw-man",
    popularity: 18,
    color: "partial",
    colorNote: "Official-color chapters 1–97; chapters 98–232 remain HD black & white",
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
    popularity: 40,
    color: "partial",
    colorNote: "Fan-colored chapters 202–228; chapters 1–201 and 229–392 remain HD black & white",
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
      "Yūki Tabata's magic-knight shonen with chapters 202–228 fan-colored in HD.",
    synopsis:
      "Read Black Clover online free, with fan-colored chapters 202–228 and the complete chapter set through 392 preserved in HD black & white everywhere else. Asta, born with no magic in a world where it is everything, and his rival Yuno chase the same dream: to become the Wizard King. Every chapter is honestly labeled in a fast mobile reader with pinch-to-zoom.",
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
    popularity: 26,
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
    poster: "/covers/rurouni-kenshin.png",
    posterPosition: "center",
    accent: "#c0392b",
    mark: "🗡️",
    totalChapters: 255,
  },
  {
    slug: "my-hero-academia",
    popularity: 11,
    color: "full",
    colorNote: "A curated collection of fan-colored chapters — more added as colorists release them",
    title: "My Hero Academia",
    nativeTitle: "僕のヒーローアカデミア",
    altTitles: ["Boku no Hero Academia", "MHA", "BNHA", "My Hero Academia Color"],
    author: "Kōhei Horikoshi",
    publisher: "Shueisha",
    genres: ["Action", "Superhero", "Adventure"],
    status: "live",
    unit: "chapter",
    year: 2014,
    imageBase: MY_HERO_ACADEMIA_IMAGE_BASE,
    tagline:
      "Kōhei Horikoshi's superhero epic — a growing collection of fan-colored chapters in full color, HD.",
    synopsis:
      "Read My Hero Academia in color online for free — a curated collection of fan-colored chapters in HD full color. Izuku Midoriya's journey from Quirkless boy to hero at U.A. High, with every hosted chapter fully colored by fan colorists (72 chapters and growing — the collection spans key arcs from the Overhaul era through the Final War). Clearly labeled, no signup, a fast mobile-friendly reader with zoom on every page.",
    keywords: [
      "my hero academia colored manga",
      "mha colored manga",
      "my hero academia color",
      "read my hero academia in color",
      "boku no hero academia colored",
      "my hero academia manga online free",
    ],
    poster: "/covers/my-hero-academia.jpg",
    accent: "#2ecc71",
    mark: "💥",
    totalChapters: 72,
  },
  {
    slug: "jujutsu-kaisen",
    popularity: 10,
    color: "full",
    title: "Jujutsu Kaisen",
    nativeTitle: "呪術廻戦",
    altTitles: ["JJK", "Sorcery Fight", "Jujutsu Kaisen Color", "Colorized Jujutsu Kaisen"],
    author: "Gege Akutami",
    publisher: "Shueisha",
    genres: ["Action", "Supernatural", "Dark Fantasy"],
    status: "live",
    unit: "chapter",
    year: 2018,
    imageBase: JUJUTSU_KAISEN_IMAGE_BASE,
    tagline: "Gege Akutami's curse-hunter epic — the full run, fan-colored in HD.",
    synopsis:
      "Read the colorized Jujutsu Kaisen manga online for free — Yuji Itadori and the Tokyo Jujutsu High sorcerers against cursed spirits and Sukuna, in a complete fan-colorization instead of black and white. The whole run digitally colored in high definition, no signup, a fast mobile-friendly reader with zoom on every page.",
    keywords: ["colorized jujutsu kaisen manga", "jujutsu kaisen colored", "jjk colored manga", "jujutsu kaisen color", "read jujutsu kaisen in color", "jjk full color"],
    poster: "/covers/jujutsu-kaisen-shrine.png",
    posterPosition: "center",
    accent: "#8e44ad",
    mark: "👊",
    totalChapters: 270,
  },
  {
    slug: "berserk",
    popularity: 19,
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
    totalChapters: 384,
  },
  {
    slug: "dr-stone",
    popularity: 45,
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
    totalChapters: 229,
  },
  {
    slug: "mob-psycho-100",
    popularity: 53,
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
    popularity: 41,
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
    totalChapters: 204,
  },
  {
    slug: "kaiju-no-8",
    popularity: 54,
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
    popularity: 55,
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
    popularity: 47,
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
    popularity: 14,
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
    popularity: 22,
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
    popularity: 36,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Tokyo Revengers",
    nativeTitle: "東京卍リベンジャーズ",
    altTitles: ["Tokyo Manji Revengers", "Tokyo Revengers Manga"],
    author: "Ken Wakui",
    publisher: "Kodansha",
    genres: ["Action", "Drama", "Delinquents", "Time Travel"],
    status: "live",
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
    popularity: 51,
    color: "partial",
    colorNote: "Colored where available — remaining chapters in HD black & white, full color coming soon",
    title: "Fire Force",
    nativeTitle: "炎炎ノ消防隊",
    altTitles: ["Enen no Shouboutai", "Fire Force Manga", "Fire Force Color"],
    author: "Atsushi Ohkubo",
    publisher: "Kodansha",
    genres: ["Action", "Supernatural", "Sci-Fi"],
    status: "live",
    unit: "chapter",
    year: 2015,
    imageBase: FIRE_FORCE_IMAGE_BASE,
    tagline:
      "Atsushi Ohkubo's Fire Force — with a fan-colored run of chapters in full color.",
    synopsis:
      "Read Fire Force online free — the complete manga, now with dozens of chapters in fan-made full color and the rest in high-quality black & white. In a world where people spontaneously combust into rampaging Infernals, third-generation pyrokinetic Shinra Kusakabe joins Special Fire Force Company 8 to burn away a burning conspiracy, in Atsushi Ohkubo's blazing action epic. Colored chapters are clearly marked; every page loads in a fast mobile reader with pinch-to-zoom. No signup, no paywall.",
    keywords: ["fire force colored manga", "fire force color", "read fire force in color", "fire force manga online free", "read fire force manga", "fire force full manga"],
    poster: "/covers/fire-force.jpg",
    accent: "#d94f1a",
    mark: "🔥",
    totalChapters: 304,
  },
  {
    slug: "vinland-saga",
    popularity: 29,
    color: "partial",
    colorNote: "Fan-colored chapters 71 and 180; all other available chapters remain HD black & white",
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
      "Makoto Yukimura's Viking epic with chapters 71 and 180 fan-colored in HD.",
    synopsis:
      "Read Vinland Saga online free, including verified fan-colored chapters 71 and 180 while all other available chapters remain honestly labeled HD black & white. Young Thorfinn joins Viking mercenaries to avenge his father, then must learn what it means to be a true warrior in Makoto Yukimura's sweeping historical epic. No signup, no paywall, with a fast mobile reader and pinch-to-zoom.",
    keywords: ["vinland saga manga online free", "read vinland saga manga", "vinland saga manga black and white", "vinland saga full manga", "vinland saga manga free"],
    poster: "/covers/vinland-saga.jpg",
    accent: "#3a5a40",
    mark: "⚔️",
    totalChapters: 220,
  },
  {
    slug: "the-promised-neverland",
    popularity: 33,
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
    popularity: 27,
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
    popularity: 28,
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
    popularity: 58,
    color: "partial",
    colorNote: "Official-color chapters 1–7; chapters 8–150 remain HD black & white",
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
      "Kazue Kato's demon-hunting adventure with chapters 1–7 in official full color.",
    synopsis:
      "Read Blue Exorcist online free, with official-color English chapters 1–7 and chapters 8–150 preserved in honestly labeled HD black & white. Rin Okumura learns he is the son of Satan and enters True Cross Academy to become an exorcist strong enough to defeat his own father. No signup, no paywall, with a fast mobile reader and pinch-to-zoom.",
    keywords: ["blue exorcist manga online free", "read blue exorcist manga", "blue exorcist manga black and white", "blue exorcist full manga", "blue exorcist manga free"],
    poster: "/covers/blue-exorcist.jpg",
    accent: "#1e5fd8",
    mark: "🔵",
    totalChapters: 150,
  },
  {
    slug: "food-wars",
    popularity: 56,
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
    totalChapters: 240,
  },
  {
    slug: "seven-deadly-sins",
    popularity: 37,
    color: "partial",
    colorNote: "Fan-colored chapter 324; all other chapters remain HD black & white",
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
      "Nakaba Suzuki's complete fantasy adventure with chapter 324 fan-colored in HD.",
    synopsis:
      "Read The Seven Deadly Sins online free, with chapter 324 in verified English fan color and the rest of Nakaba Suzuki's complete 346-chapter fantasy preserved in honestly labeled HD black & white. Princess Elizabeth seeks out the legendary knights branded as traitors to reclaim her kingdom. No signup, no paywall, with a fast mobile reader and pinch-to-zoom.",
    keywords: ["the seven deadly sins manga online free", "read the seven deadly sins manga", "the seven deadly sins manga black and white", "the seven deadly sins full manga", "the seven deadly sins manga free"],
    poster: "/covers/seven-deadly-sins.jpg",
    accent: "#6a2ea0",
    mark: "🐗",
    totalChapters: 346,
  },
  {
    slug: "world-trigger",
    popularity: 59,
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
    popularity: 61,
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
    popularity: 43,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "20th Century Boys",
    nativeTitle: "20世紀少年",
    altTitles: ["20th Century Boys Manga", "Nijusseiki Shonen"],
    author: "Naoki Urasawa",
    publisher: "Shogakukan",
    genres: ["Mystery", "Thriller", "Sci-Fi", "Drama"],
    status: "live",
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
    popularity: 31,
    color: "full",
    title: "Solo Leveling",
    nativeTitle: "나 혼자만 레벨업",
    altTitles: ["Na Honjaman Level Up", "Only I Level Up", "Solo Leveling Manhwa", "Solo Leveling Color"],
    author: "Chugong",
    publisher: "D&C Media",
    genres: ["Action", "Fantasy", "Adventure"],
    status: "live",
    unit: "chapter",
    year: 2018,
    imageBase: SOLO_LEVELING_IMAGE_BASE,
    tagline:
      "Chugong's record-breaking hunter epic — the complete webtoon in native full color, HD.",
    synopsis:
      "Read the Solo Leveling manhwa online for free in full color — the complete webtoon, natively produced in color on every page. Weakest-hunter Sung Jinwoo gains a mysterious leveling system after a deadly dungeon and rises from the bottom to the most powerful hunter alive, in Chugong's record-breaking action fantasy. All chapters in HD full color with a fast mobile-friendly reader and zoom on every page. No signup, no paywall.",
    keywords: ["solo leveling colored", "solo leveling full color", "solo leveling manhwa color", "read solo leveling in color", "solo leveling manga online free", "solo leveling webtoon free"],
    poster: "/covers/solo-leveling.jpg",
    accent: "#5b21b6",
    mark: "⚔️",
    totalChapters: 200,
  },
  {
    slug: "haikyu",
    popularity: 35,
    color: "full",
    colorNote: "Complete official-color English edition: chapters 1–402",
    title: "Haikyu!!",
    nativeTitle: "ハイキュー!!",
    altTitles: ["Haikyuu", "Haikyu Manga"],
    author: "Haruichi Furudate",
    publisher: "Shueisha",
    genres: ["Sports", "Comedy", "Drama"],
    status: "live",
    unit: "chapter",
    year: 2012,
    imageBase: HAIKYU_IMAGE_BASE,
    tagline:
      "Haruichi Furudate's complete volleyball epic — all 402 chapters in official full color.",
    synopsis:
      "Read the complete Haikyu!! manga in official full color online free — all 402 English chapters of Haruichi Furudate's beloved volleyball epic. Short but sky-hungry Shoyo Hinata joins Karasuno High and forms an explosive partnership with prodigy setter Kageyama. Every available chapter is genuinely colorized in a fast mobile reader with pinch-to-zoom, no signup or paywall.",
    keywords: ["haikyu manga online free", "read haikyu manga", "haikyu manga black and white", "haikyu full manga", "haikyu manga free"],
    poster: "/covers/haikyu.jpg",
    accent: "#e07a1a",
    mark: "🏐",
    totalChapters: 402,
  },
  {
    slug: "one-punch-man",
    popularity: 23,
    color: "partial",
    colorNote: "Chapters 100–221 in fan-made full color — earlier chapters in HD black & white",
    title: "One Punch Man",
    nativeTitle: "ワンパンマン",
    altTitles: ["Onepunch-Man", "OPM", "One Punch Man Color"],
    author: "ONE & Yusuke Murata",
    publisher: "Shueisha",
    genres: ["Action", "Comedy", "Superhero"],
    status: "live",
    unit: "chapter",
    year: 2012,
    imageBase: ONE_PUNCH_MAN_IMAGE_BASE,
    tagline:
      "ONE's One Punch Man — chapters 100–221 in full color, the rest in HD black & white.",
    synopsis:
      "Read One Punch Man online free — chapters 100–221 in fan-made full color and the earlier chapters in high-quality black & white. Saitama, the hero who ends every fight with a single punch, hunts for an opponent worth the effort in ONE and Yusuke Murata's gloriously drawn action-comedy. Colored chapters are clearly marked; every page loads in a fast mobile reader with pinch-to-zoom. No signup, no paywall.",
    keywords: ["one punch man colored manga", "one punch man color", "read one punch man in color", "one punch man manga online free", "opm manga free"],
    poster: "/covers/one-punch-man.jpg",
    accent: "#e0b310",
    mark: "👊",
    totalChapters: 220,
  },
  {
    slug: "spy-x-family",
    color: "partial",
    colorNote: "Official-color chapters 1–37; all other available chapters remain HD black & white (chapter 112 is not available upstream)",
    title: "Spy x Family",
    nativeTitle: "SPY×FAMILY",
    altTitles: ["SpyFamily", "Spy Family Manga"],
    author: "Tatsuya Endo",
    publisher: "Shueisha",
    genres: ["Action", "Comedy", "Slice of Life"],
    status: "live",
    unit: "chapter",
    year: 2019,
    imageBase: SPY_X_FAMILY_IMAGE_BASE,
    tagline:
      "Tatsuya Endo's hit spy comedy with chapters 1–37 in official full color.",
    synopsis:
      "Read Spy x Family online free, with official-color English chapters 1–37 and every other available chapter preserved in honestly labeled HD black & white. Master spy Twilight builds a fake family for a mission, unaware his adopted daughter reads minds and his wife is an assassin. Chapter 112 is absent from the original public sources, so no fake route is generated. No signup or paywall.",
    keywords: ["spy x family manga online free", "read spy x family manga", "spy x family manga black and white", "spy x family full manga", "spy x family manga free"],
    poster: "/covers/spy-x-family.jpg",
    accent: "#3f7d5c",
    mark: "🕵️",
    totalChapters: 117,
  },
  {
    slug: "parasyte",
    popularity: 36,
    color: "full",
    colorNote: "Complete official-color English edition: chapters 1–64",
    title: "Parasyte",
    nativeTitle: "寄生獣",
    altTitles: ["Kiseijū", "Kiseiju", "Parasyte Full Color Collection"],
    author: "Hitoshi Iwaaki",
    publisher: "Kodansha",
    genres: ["Horror", "Science Fiction", "Action", "Psychological"],
    status: "live",
    unit: "chapter",
    year: 1988,
    imageBase: PARASYTE_IMAGE_BASE,
    tagline:
      "Hitoshi Iwaaki's complete sci-fi horror classic — all 64 chapters in official full color.",
    synopsis:
      "Read Parasyte in official full color online free — all 64 chapters of Hitoshi Iwaaki's complete sci-fi horror classic in English. After an alien parasite fails to take over Shinichi Izumi's brain and becomes trapped in his right hand, the unlikely pair must survive other parasites hiding behind human faces. Every available chapter is genuinely colorized and clearly labeled, with a fast mobile reader and pinch-to-zoom.",
    keywords: [
      "parasyte full color manga",
      "parasyte colored manga",
      "read parasyte in color",
      "kiseiju full color",
      "parasyte manga online free",
    ],
    poster: "/covers/parasyte.jpg",
    posterPosition: "50% 18%",
    accent: "#cf2d24",
    mark: "🖐️",
    totalChapters: 64,
  },
  {
    slug: "darling-in-the-franxx",
    popularity: 49,
    color: "full",
    colorNote: "Fan-colored chapters 54–57; these are the only chapters currently served",
    title: "DARLING in the FRANXX",
    nativeTitle: "ダーリン・イン・ザ・フランキス",
    altTitles: ["Darling in the Franxx Manga", "DarliFra", "DITF"],
    author: "Code:000 & Kentaro Yabuki",
    publisher: "Shueisha",
    genres: ["Science Fiction", "Romance", "Action", "Drama"],
    status: "live",
    unit: "chapter",
    year: 2018,
    imageBase: DARLING_IN_THE_FRANXX_IMAGE_BASE,
    tagline:
      "Kentaro Yabuki's divergent manga adaptation — chapters 54–57 fan-colored in HD.",
    synopsis:
      "Read DARLING in the FRANXX manga chapters 54–57 in verified English fan color. Hiro, Zero Two and Squad 13 pilot FRANXX against the Klaxosaurs in Kentaro Yabuki and Code:000's manga adaptation, whose story diverges from the anime. Only the four genuinely colored chapters are published here — no fabricated gap routes — and the reader moves directly through the real available chapter set.",
    keywords: [
      "darling in the franxx colored manga",
      "darling in the franxx manga color",
      "read darling in the franxx manga",
      "zero two colored manga",
      "darling in the franxx chapter 54",
    ],
    poster: "/covers/darling-in-the-franxx.jpg",
    posterPosition: "50% 16%",
    accent: "#e83f5b",
    mark: "🌸",
    totalChapters: 60,
  },
  {
    slug: "frieren",
    popularity: 42,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Frieren: Beyond Journey's End",
    nativeTitle: "葬送のフリーレン",
    altTitles: ["Sousou no Frieren", "Frieren Manga"],
    author: "Kanehito Yamada & Tsukasa Abe",
    publisher: "Shogakukan",
    genres: ["Fantasy", "Adventure", "Drama"],
    status: "live",
    unit: "chapter",
    year: 2020,
    imageBase: FRIEREN_IMAGE_BASE,
    tagline:
      "Kanehito Yamada & Tsukasa Abe's Frieren: Beyond Journey's End — the complete manga in HD black & white, free.",
    synopsis:
      "Read Frieren: Beyond Journey's End online free — the complete manga in high-quality black & white. Elf mage Frieren outlives the hero party that defeated the Demon King and walks the long road to understand the humans she lost, in the beloved, quietly devastating fantasy. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["frieren: beyond journey's end manga online free", "read frieren: beyond journey's end manga", "frieren: beyond journey's end manga black and white", "frieren: beyond journey's end full manga", "frieren: beyond journey's end manga free"],
    poster: "/covers/frieren.jpg",
    accent: "#7fa6c9",
    mark: "🧝",
    totalChapters: 147,
  },
  {
    slug: "gintama",
    popularity: 38,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Gintama",
    nativeTitle: "銀魂",
    altTitles: ["Gin Tama", "Silver Soul"],
    author: "Hideaki Sorachi",
    publisher: "Shueisha",
    genres: ["Action", "Comedy", "Sci-Fi"],
    status: "live",
    unit: "chapter",
    year: 2003,
    imageBase: GINTAMA_IMAGE_BASE,
    tagline:
      "Hideaki Sorachi's Gintama — the complete manga in HD black & white, free.",
    synopsis:
      "Read Gintama online free — the complete manga in high-quality black & white. Odd-jobs samurai Gintoki takes any gig in an alien-occupied Edo, in Hideaki Sorachi's legendary genre-demolishing comedy that can turn heartbreaking on a page. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["gintama manga online free", "read gintama manga", "gintama manga black and white", "gintama full manga", "gintama manga free"],
    poster: "/covers/gintama.jpg",
    accent: "#b7c3d0",
    mark: "🍡",
    totalChapters: 697,
  },
  {
    slug: "monster",
    popularity: 32,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Monster",
    nativeTitle: "MONSTER",
    altTitles: ["Naoki Urasawa's Monster"],
    author: "Naoki Urasawa",
    publisher: "Shogakukan",
    genres: ["Thriller", "Mystery", "Psychological", "Seinen"],
    status: "live",
    unit: "chapter",
    year: 1994,
    imageBase: MONSTER_IMAGE_BASE,
    tagline:
      "Naoki Urasawa's Monster — the complete manga in HD black & white, free.",
    synopsis:
      "Read Monster online free — the complete manga in high-quality black & white. Brilliant surgeon Kenzo Tenma saves a boy's life and spends the rest of his own hunting the monster that boy becomes, in Naoki Urasawa's masterpiece of suspense. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["monster manga online free", "read monster manga", "monster manga black and white", "monster full manga", "monster manga free"],
    poster: "/covers/monster.jpg",
    accent: "#5c5c66",
    mark: "🕯️",
    totalChapters: 162,
  },
  {
    slug: "vagabond",
    popularity: 20,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Vagabond",
    nativeTitle: "バガボンド",
    altTitles: ["Vagabond Manga", "Musashi"],
    author: "Takehiko Inoue",
    publisher: "Kodansha",
    genres: ["Action", "Historical", "Seinen"],
    status: "live",
    unit: "chapter",
    year: 1998,
    imageBase: VAGABOND_IMAGE_BASE,
    tagline:
      "Takehiko Inoue's Vagabond — the complete manga in HD black & white, free.",
    synopsis:
      "Read Vagabond online free — the complete manga in high-quality black & white. Takezo becomes Miyamoto Musashi, sword saint, one duel at a time — Takehiko Inoue's ink-brushed epic of violence and enlightenment. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["vagabond manga online free", "read vagabond manga", "vagabond manga black and white", "vagabond full manga", "vagabond manga free"],
    poster: "/covers/vagabond.jpg",
    accent: "#4a3527",
    mark: "⚔️",
    totalChapters: 327,
  },
  {
    slug: "slam-dunk",
    popularity: 9,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Slam Dunk",
    nativeTitle: "SLAM DUNK",
    altTitles: ["Slam Dunk Manga"],
    author: "Takehiko Inoue",
    publisher: "Shueisha",
    genres: ["Sports", "Comedy", "Drama"],
    status: "live",
    unit: "chapter",
    year: 1990,
    imageBase: SLAM_DUNK_IMAGE_BASE,
    tagline:
      "Takehiko Inoue's Slam Dunk — the complete manga in HD black & white, free.",
    synopsis:
      "Read Slam Dunk online free — the complete manga in high-quality black & white. Delinquent Hanamichi Sakuragi joins the basketball team for a girl and falls for the game itself, in Takehiko Inoue's all-time sports classic. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["slam dunk manga online free", "read slam dunk manga", "slam dunk manga black and white", "slam dunk full manga", "slam dunk manga free"],
    poster: "/covers/slam-dunk.jpg",
    accent: "#c4372c",
    mark: "🏀",
    totalChapters: 276,
  },
  {
    slug: "sakamoto-days",
    popularity: 52,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Sakamoto Days",
    nativeTitle: "サカモトデイズ",
    altTitles: ["Sakamoto Days Manga"],
    author: "Yuto Suzuki",
    publisher: "Shueisha",
    genres: ["Action", "Comedy"],
    status: "live",
    unit: "chapter",
    year: 2020,
    imageBase: SAKAMOTO_DAYS_IMAGE_BASE,
    tagline:
      "Yuto Suzuki's Sakamoto Days — the complete manga in HD black & white, free.",
    synopsis:
      "Read Sakamoto Days online free — the complete manga in high-quality black & white. Legendary hitman Taro Sakamoto retired for love, got fat, and runs a corner store — until the underworld comes calling, in Yuto Suzuki's inventive action hit. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["sakamoto days manga online free", "read sakamoto days manga", "sakamoto days manga black and white", "sakamoto days full manga", "sakamoto days manga free"],
    poster: "/covers/sakamoto-days.jpg",
    accent: "#d97b29",
    mark: "🏪",
    totalChapters: 270,
  },
  {
    slug: "komi-cant-communicate",
    popularity: 49,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Komi Can't Communicate",
    nativeTitle: "古見さんは、コミュ症です。",
    altTitles: ["Komi-san wa Comyushou desu", "Komi San"],
    author: "Tomohito Oda",
    publisher: "Shogakukan",
    genres: ["Comedy", "Romance", "Slice of Life"],
    status: "live",
    unit: "chapter",
    year: 2016,
    imageBase: KOMI_CANT_COMMUNICATE_IMAGE_BASE,
    tagline:
      "Tomohito Oda's Komi Can't Communicate — the complete manga in HD black & white, free.",
    synopsis:
      "Read Komi Can't Communicate online free — the complete manga in high-quality black & white. School goddess Komi can't speak to anyone — classmate Tadano becomes her interpreter on a mission to make 100 friends, in Tomohito Oda's warm-hearted comedy. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["komi can't communicate manga online free", "read komi can't communicate manga", "komi can't communicate manga black and white", "komi can't communicate full manga", "komi can't communicate manga free"],
    poster: "/covers/komi-cant-communicate.jpg",
    accent: "#c9679a",
    mark: "💬",
    totalChapters: 496,
  },
  {
    slug: "assassination-classroom",
    popularity: 44,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Assassination Classroom",
    nativeTitle: "暗殺教室",
    altTitles: ["Ansatsu Kyoushitsu", "AssClass"],
    author: "Yusei Matsui",
    publisher: "Shueisha",
    genres: ["Action", "Comedy", "School"],
    status: "live",
    unit: "chapter",
    year: 2012,
    imageBase: ASSASSINATION_CLASSROOM_IMAGE_BASE,
    tagline:
      "Yusei Matsui's Assassination Classroom — the complete manga in HD black & white, free.",
    synopsis:
      "Read Assassination Classroom online free — the complete manga in high-quality black & white. Class 3-E must assassinate their tentacled, Mach-20 teacher before graduation — the same teacher saving their lives, in Yusei Matsui's ingenious classroom thriller. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["assassination classroom manga online free", "read assassination classroom manga", "assassination classroom manga black and white", "assassination classroom full manga", "assassination classroom manga free"],
    poster: "/covers/assassination-classroom.jpg",
    accent: "#e8c832",
    mark: "🐙",
    totalChapters: 180,
  },
  {
    slug: "kagurabachi",
    popularity: 64,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Kagurabachi",
    nativeTitle: "カグラバチ",
    altTitles: ["Kagura Bachi"],
    author: "Takeru Hokazono",
    publisher: "Shueisha",
    genres: ["Action", "Fantasy"],
    status: "live",
    unit: "chapter",
    year: 2023,
    imageBase: KAGURABACHI_IMAGE_BASE,
    tagline:
      "Takeru Hokazono's Kagurabachi — the complete manga in HD black & white, free.",
    synopsis:
      "Read Kagurabachi online free — the complete manga in high-quality black & white. Chihiro carries his murdered father's last enchanted blade toward revenge, in Takeru Hokazono's breakout dark-sorcery action hit. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["kagurabachi manga online free", "read kagurabachi manga", "kagurabachi manga black and white", "kagurabachi full manga", "kagurabachi manga free"],
    poster: "/covers/kagurabachi.jpg",
    accent: "#2d3a8c",
    mark: "🗡️",
    totalChapters: 124,
  },
  {
    slug: "detective-conan",
    popularity: 6,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Detective Conan",
    nativeTitle: "名探偵コナン",
    altTitles: ["Case Closed", "Meitantei Conan"],
    author: "Gosho Aoyama",
    publisher: "Shogakukan",
    genres: ["Mystery", "Detective", "Comedy"],
    status: "live",
    unit: "chapter",
    year: 1994,
    imageBase: DETECTIVE_CONAN_IMAGE_BASE,
    tagline:
      "Gosho Aoyama's Detective Conan — the complete manga in HD black & white, free.",
    synopsis:
      "Read Detective Conan online free — the complete manga in high-quality black & white. High-school detective Shinichi Kudo is shrunk to a child by a poison and solves murders as Conan Edogawa while hunting the Black Organization, in the best-selling mystery manga of all time. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["detective conan manga online free", "read detective conan manga", "detective conan manga black and white", "detective conan full manga", "detective conan manga free"],
    poster: "/covers/detective-conan.jpg",
    accent: "#1f4fa3",
    mark: "🔍",
    totalChapters: 1166,
  },
  {
    slug: "doraemon",
    popularity: 17,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Doraemon",
    nativeTitle: "ドラえもん",
    altTitles: ["Doraemon Manga"],
    author: "Fujiko F. Fujio",
    publisher: "Shogakukan",
    genres: ["Comedy", "Sci-Fi", "Slice of Life"],
    status: "live",
    unit: "chapter",
    year: 1969,
    imageBase: DORAEMON_IMAGE_BASE,
    tagline:
      "Fujiko F. Fujio's Doraemon — the complete manga in HD black & white, free.",
    synopsis:
      "Read Doraemon online free — the complete manga in high-quality black & white. A robotic cat from the 22nd century and his gadget-filled pocket look after hapless Nobita, in the beloved classic that defined childhood across Asia. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["doraemon manga online free", "read doraemon manga", "doraemon manga black and white", "doraemon full manga", "doraemon manga free"],
    poster: "/covers/doraemon.jpg",
    accent: "#2f9fd0",
    mark: "🐱",
    totalChapters: 17,
  },
  {
    slug: "fist-of-the-north-star",
    popularity: 16,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Fist of the North Star",
    nativeTitle: "北斗の拳",
    altTitles: ["Hokuto no Ken", "Ken il guerriero"],
    author: "Buronson & Tetsuo Hara",
    publisher: "Shueisha",
    genres: ["Action", "Post-Apocalyptic", "Martial Arts"],
    status: "live",
    unit: "chapter",
    year: 1983,
    imageBase: FIST_OF_THE_NORTH_STAR_IMAGE_BASE,
    tagline:
      "Buronson & Tetsuo Hara's Fist of the North Star — the complete manga in HD black & white, free.",
    synopsis:
      "Read Fist of the North Star online free — the complete manga in high-quality black & white. Kenshiro walks a nuclear wasteland dealing death with the assassin art of Hokuto Shinken, in the manga that set the template for shonen action. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["fist of the north star manga online free", "read fist of the north star manga", "fist of the north star manga black and white", "fist of the north star full manga", "fist of the north star manga free"],
    poster: "/covers/fist-of-the-north-star.jpg",
    accent: "#8b1e1e",
    mark: "💥",
    totalChapters: 245,
  },
  {
    slug: "sailor-moon",
    popularity: 24,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Sailor Moon",
    nativeTitle: "美少女戦士セーラームーン",
    altTitles: ["Bishoujo Senshi Sailor Moon", "Pretty Guardian Sailor Moon"],
    author: "Naoko Takeuchi",
    publisher: "Kodansha",
    genres: ["Magical Girl", "Romance", "Fantasy"],
    status: "live",
    unit: "chapter",
    year: 1991,
    imageBase: SAILOR_MOON_IMAGE_BASE,
    tagline:
      "Naoko Takeuchi's Sailor Moon — the complete manga in HD black & white, free.",
    synopsis:
      "Read Sailor Moon online free — the complete manga in high-quality black & white. Usagi Tsukino transforms into Sailor Moon and leads the Sailor Guardians against the forces threatening Earth, in the series that created the modern magical-girl genre. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["sailor moon manga online free", "read sailor moon manga", "sailor moon manga black and white", "sailor moon full manga", "sailor moon manga free"],
    poster: "/covers/sailor-moon.jpg",
    accent: "#d05a9c",
    mark: "🌙",
    totalChapters: 59,
  },
  {
    slug: "inuyasha",
    popularity: 25,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Inuyasha",
    nativeTitle: "犬夜叉",
    altTitles: ["InuYasha", "Inu Yasha"],
    author: "Rumiko Takahashi",
    publisher: "Shogakukan",
    genres: ["Adventure", "Fantasy", "Romance"],
    status: "live",
    unit: "chapter",
    year: 1996,
    imageBase: INUYASHA_IMAGE_BASE,
    tagline:
      "Rumiko Takahashi's Inuyasha — the complete manga in HD black & white, free.",
    synopsis:
      "Read Inuyasha online free — the complete manga in high-quality black & white. Modern schoolgirl Kagome falls through a well into the Sengoku era and joins half-demon Inuyasha to gather the shards of the Shikon Jewel, in Rumiko Takahashi's global classic. No official full-color edition exists yet, so every chapter is hosted here in black & white, clearly labeled, with a fast mobile reader and pinch-to-zoom on every page. The colorized version is coming soon. No signup, no paywall.",
    keywords: ["inuyasha manga online free", "read inuyasha manga", "inuyasha manga black and white", "inuyasha full manga", "inuyasha manga free"],
    poster: "/covers/inuyasha.jpg",
    accent: "#b04a2a",
    mark: "🐺",
    totalChapters: 558,
  },
  {
    slug: "kingdom",
    popularity: 15,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Kingdom",
    nativeTitle: "キングダム",
    altTitles: ["Kingudamu", "Kingdom Manga"],
    author: "Yasuhisa Hara",
    publisher: "Shueisha",
    genres: ["Action", "Historical", "Military", "Drama"],
    status: "live",
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
    popularity: 46,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Oshi no Ko",
    nativeTitle: "【推しの子】",
    altTitles: ["My Star", "Oshi no Ko Manga"],
    author: "Aka Akasaka",
    publisher: "Shueisha",
    genres: ["Drama", "Mystery", "Psychological"],
    status: "live",
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
    popularity: 50,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Black Butler",
    nativeTitle: "黒執事",
    altTitles: ["Kuroshitsuji", "Black Butler Manga"],
    author: "Yana Toboso",
    publisher: "Square Enix",
    genres: ["Dark Fantasy", "Mystery", "Historical", "Comedy"],
    status: "live",
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
    popularity: 60,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Soul Eater",
    nativeTitle: "ソウルイーター",
    altTitles: ["Soul Eater Manga"],
    author: "Atsushi Ohkubo",
    publisher: "Square Enix",
    genres: ["Action", "Supernatural", "Comedy", "Dark Fantasy"],
    status: "live",
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
    popularity: 62,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Noragami",
    nativeTitle: "ノラガミ",
    altTitles: ["Noragami Manga", "Stray God"],
    author: "Adachitoka",
    publisher: "Kodansha",
    genres: ["Action", "Supernatural", "Comedy", "Drama"],
    status: "live",
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
    popularity: 63,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Goblin Slayer",
    nativeTitle: "ゴブリンスレイヤー",
    altTitles: ["Goblin Slayer Manga"],
    author: "Kumo Kagyu",
    publisher: "Square Enix",
    genres: ["Dark Fantasy", "Action", "Adventure"],
    status: "live",
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
    popularity: 57,
    color: "none",
    colorNote: "Complete series in black & white — colorized version coming soon",
    title: "Goodnight Punpun",
    nativeTitle: "おやすみプンプン",
    altTitles: ["Oyasumi Punpun", "Goodnight Punpun Manga"],
    author: "Inio Asano",
    publisher: "Shogakukan",
    genres: ["Drama", "Psychological", "Slice of Life", "Coming of Age"],
    status: "live",
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
