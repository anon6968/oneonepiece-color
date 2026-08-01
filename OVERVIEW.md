# colorizedmangas.com — Complete Codebase, SEO & Deployment Overview

_Read this top-to-bottom for a full understanding of what the site is, how the code is structured, how every page is generated, how SEO works, and how it deploys. Companion docs: `DEPLOYMENT.md` (deploy specifics), `context.md` (project handoff)._

_Last updated: 2026-08-02._

---

## 1. What it is
A **manga reader** at `colorizedmangas.com`. It serves ~46 series in **full/partial color** (digitally colorized) plus ~30 series in **high-quality black & white** (series with no color edition, hosted to capture their search demand). It is a **100% static site** (no backend, no database) that is almost entirely an **SEO property** — ~80%+ of traffic is organic search, concentrated on deep chapter pages.

## 2. Big-picture architecture
```
Visitor → Cloudflare edge (DNS + CDN)  → Cloudflare Pages  (project: colorizedmanga-web)
                                          └─ serves ~13k static HTML pages
Manga page images  →  GitHub repos (anon6968/*-color-pages)  →  jsDelivr CDN  (cdn.jsdelivr.net)
                                          └─ NOT hosted on Pages; free + unlimited
```
- **Framework:** Next.js 16, App Router, `output: "export"` → the whole site is pre-rendered to flat `.html` files at build time. There is no server at runtime.
- **Host:** Cloudflare Pages (free, unlimited requests/bandwidth). Vercel is a cold rollback only.
- **Images:** every reader page image lives in GitHub repos and is served via jsDelivr — never touches the host. This is why the host stays tiny/free.
- **Cost:** ~$15/yr (domain) — everything else is $0.

## 3. Codebase map (`web/`)
```
web/
├─ app/                         # Next.js App Router — one folder per route
│  ├─ page.tsx                  # HOMEPAGE (hero, library grid, FAQ, color/B&W toggle)
│  ├─ [manga]/                  # dynamic per-series routes:
│  │  ├─ page.tsx               #   /<series>        → series hub (or Parts hub for JoJo)
│  │  ├─ chapters/page.tsx      #   /<series>/chapters→ full chapter list (by arc)
│  │  ├─ volumes/page.tsx       #   /<series>/volumes → volume list (Naruto)
│  │  ├─ latest/page.tsx        #   /<series>/latest  → newest chapters
│  │  ├─ chapter/[n]/page.tsx   #   /<series>/chapter/<n> → the READER (per chapter)
│  │  └─ volume/[n]/page.tsx    #   /<series>/volume/<n>  → the READER (per volume)
│  ├─ contact|dmca|terms|privacy/page.tsx   # legal/contact pages
│  ├─ sitemap.ts                # generates /sitemap.xml (with image entries)
│  ├─ robots.ts                 # generates /robots.txt
│  ├─ feed.xml/route.ts         # RSS of latest chapters
│  ├─ llms.txt/route.ts         # AI-answer-engine map (llmstxt.org)
│  ├─ layout.tsx                # sitewide <head>: Organization+WebSite JSON-LD, fonts, nav
│  └─ logo-lab/                 # internal/experimental — robots-disallowed, noindex
├─ lib/                         # the "brains"
│  ├─ manga.ts                  # ⭐ THE SERIES REGISTRY (single source of truth). Manga type,
│  │                            #    HAND_MANGAS[], merges AUTO_MANGAS, MANGAS = [...].filter(!hidden)
│  ├─ site.ts                   # SITE config: name, url, keywords, contact; URL + SEO-title helpers
│  ├─ data.ts                   # reads data/manga/<slug>/ → chapters, stats, arcs
│  ├─ unit-page.tsx             # shared READER page (chapter & volume) + its generateMetadata + JSON-LD
│  ├─ list-page.tsx             # shared /chapters + /volumes list page + metadata
│  └─ naruto-volumes.ts         # Naruto volume titles/mapping
├─ components/                  # UI: MangaCard, ChapterBrowser, reader (Reader/*), Header, Footer,
│  │                            #     MangaInfoPanel, ShareButton, ContinueReading, MobileNav …
├─ data/
│  ├─ auto-series.json          # auto-registered series (28) — bulk-added catalog entries
│  └─ manga/<slug>/             # per-series chapter data: index.json + chapters/ (70 dirs)
├─ public/
│  ├─ covers/<slug>.jpg|png     # series poster art (cards + OG images)
│  ├─ _redirects                # host-level 301s (Cloudflare Pages reads natively)
│  ├─ _headers                  # host-level cache-control (Pages reads natively)
│  ├─ og.png, icons, manifest, favicon
│  └─ 18959377….txt             # IndexNow key (Bing/Yandex instant indexing)
└─ next.config.ts               # output:"export", images unoptimized
```

## 4. The data model — the single source of truth
Everything (routes, metadata, sitemap, schema, cards) is generated from **one registry**: `lib/manga.ts`.
- **`Manga` type** fields drive SEO + display: `slug, title, nativeTitle, altTitles, author, publisher, genres, status ("live"|"coming-soon"), color ("full"|"partial"|"none"), colorNote, unit ("chapter"|"volume"), year, imageBase, tagline, synopsis, keywords[], poster, posterPosition, accent, mark, totalChapters, hidden, parts[]`.
- **Two sources merged:** `HAND_MANGAS[]` (hand-authored, richest metadata) + `AUTO_MANGAS` from `data/auto-series.json` (bulk catalog). Hand entries win on slug conflict.
- **The choke point:** `export const MANGAS = [...HAND, ...AUTO].filter(m => !m.hidden)`. Set `"hidden": true` and a series **vanishes everywhere** (grid, schema, sitemap, feed, and its routes 404 because `dynamicParams = false`).
- **Chapter content:** `data/manga/<slug>/index.json` lists each chapter (number, arc, saga, pageCount, title). `lib/data.ts` reads it. Actual page images come from `imageBase` (jsDelivr) via `pageUrl()`.
- **To add a series:** add a registry entry + drop its data in `data/manga/<slug>/` + push images to a GitHub `*-color-pages` repo.

## 5. All page types + current counts (≈13,130 indexable URLs)
| Route | Count | Purpose |
|---|---|---|
| `/<series>/chapter/<n>` | **~12,881** | **the reader — the SEO engine** (each chapter = 1 indexable page) |
| `/<series>/volume/<n>` | 72 | reader for volume-based series (Naruto) |
| `/<series>` | 66 | series hub (info + chapter browser + FAQ) |
| `/<series>/latest` | 59 | newest chapters |
| `/<series>/chapters` | 58 | full chapter list by arc |
| `/<series>/volumes` | 1 | volume list |
| `/` | 1 | homepage |
| `/contact` `/dmca` `/terms` `/privacy` | 4 | legal/contact |
| `/sitemap.xml` `/robots.txt` `/feed.xml` `/llms.txt` | — | crawl/discovery files |
**Series:** 72 registry entries — 13 hidden, **59 visible** (56 live, 2 coming-soon). By color: **20 full · 5 partial · 33 black-&-white**. (Coming-soon + `color:"none"`+coming-soon pages are `noindex` and excluded from the sitemap.)

## 6. SEO page formatting (the templates)
Every page has a unique `<title>`, meta description, **absolute canonical**, OG/Twitter cards, and JSON-LD. Titles by type (live examples):

| Page | Title template | Structured data |
|---|---|---|
| Home | `Colorized Manga — Read Manga in Full Color Online Free` | Organization, WebSite, CollectionPage, FAQPage |
| Series (full color) | `One Piece Colored Manga — Read in Full Color Online Free \| Colorized Manga` | ComicSeries, BreadcrumbList, FAQPage |
| Series (**black & white**) | `Tokyo Ghoul Manga — Read Tokyo Ghoul Online Free (Black & White) \| Colorized Manga` | ComicSeries, BreadcrumbList, FAQPage |
| Chapter reader | `One Piece Chapter 1 Colored: Romance Dawn — Read in Full Color Online Free \| Colorized Manga` | ComicIssue, BreadcrumbList, ComicSeries |
| Volume reader | `Naruto Volume 1 Colored: Uzumaki Naruto — Read in Full Color Online Free \| Colorized Manga` | PublicationVolume, BreadcrumbList |
| `/chapters` | `All One Piece Color Manga Chapters — Full Chapter List \| Colorized Manga` | (list) |
| `/latest` | `Latest One Piece Colored Chapters — Newest One Piece in Color \| Colorized Manga` | (list) |

The reader UI is a canvas, so each reader page ships a **crawlable `sr-only` `<h1>` + breadcrumb + `<p>`** so Google sees real text. Metadata code lives in: home = `app/page.tsx`; series = `app/[manga]/page.tsx` `generateMetadata`; reader = `lib/unit-page.tsx` `buildUnitMetadata`; lists = `lib/list-page.tsx`.

## 7. Keyword targeting (what we go after)
- **Sitewide head terms** (`lib/site.ts`): `colorized manga`, `colored manga online`, `read manga in color`, plus British spellings `colourised/coloured manga`.
- **Per-series colorized mid-tail** (`lib/manga.ts` `keywords[]`): `colorized one piece manga`, `read one piece in color`, `naruto full color edition`, …
- **Per-chapter long-tail** (`lib/unit-page.tsx`): `<series> chapter <n> colored`, `read <series> chapter <n> color`, arc variants. **This is where ~all traffic comes from.**
- **Plain series-name terms via the B&W catalog:** the **31 live black-&-white series** (Tokyo Ghoul, Berserk, Dr. Stone, Vinland Saga, Fullmetal Alchemist, Dandadan…) target the **non-colorized head keywords** — `tokyo ghoul manga`, `berserk manga online`, etc. — with `<Title> Manga — Read <Title> Online Free (Black & White)`. So we target *both* "colorized X" *and* plain "X manga".

## 8. Deployment (summary — full detail in `DEPLOYMENT.md`)
- **Deploy command:** `tools/deploy_pages.sh "note"` (workspace root) → `pnpm build` → **strip ~116k Next prefetch `.txt` files** (Cloudflare Pages caps 20,000 files/deploy; we're at ~13,150) → `wrangler pages deploy`. Atomic, instantly live, no cache purge.
- **Multi-agent hazard:** several agents build the same `web/` concurrently → Next build-lock collisions + shared `.next` corruption. Commit only your own files.

### The "don't redeploy every page" optimization (open opportunity)
- **Uploads are already incremental** — Wrangler hashes each file and skips unchanged ones. **But** Next.js currently produces a **new build ID every build**, which changes the asset-chunk URLs referenced inside *every* HTML page → so every page's bytes change → Wrangler re-uploads all ~13k (confirmed: a 5-poster change re-uploaded 13,148 files).
- **Fix (not yet applied):** set a **stable `generateBuildId`** in `next.config.ts` + keep `.next/cache` between builds. Then unchanged pages become byte-identical across builds → Wrangler skips them (only changed pages + new assets upload) → far smaller/faster deploys. Pure-asset changes (e.g. a poster) would then touch only ~6 HTML pages + the new image. **The build itself is still full** (static export re-renders all pages), but `.next/cache` makes it faster.

## 9. Invariants that must never break (SEO = priority #1)
1. **Non-existent URLs → hard 404** (Pages serves `out/404.html` with a 404 status). Never a soft-200.
2. **Sitemap contains only real, indexable pages** — coming-soon/`color:none`-coming-soon are `noindex` + excluded; `logo-lab` excluded + robots-disallowed.
3. **Absolute canonicals** to `https://colorizedmangas.com`; redirects in `public/_redirects`; cache headers in `public/_headers`.
4. **Don't change existing chapter/series URLs** — they hold 100% of the traffic.
5. robots.txt allows all search bots; the repo's own permissive `robots.ts` is authoritative (keep Cloudflare's managed AI-blocking robots.txt OFF).
