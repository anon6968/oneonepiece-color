# Colorized Manga — multi-manga reader hub

Next.js (App Router) reader for **colorizedmangas.com**. Dark "creepy pirate"
theme, mobile + desktop, SEO-first, per-page zoom/pan. The apex domain is a hub
that previews the whole library; each manga lives at `/<slug>` beneath it.

**Primary domain:** https://colorizedmangas.com (Njalla, private)
**Spelling alt:** colourisedmanga.com → 308 to primary

## Architecture

- **`lib/manga.ts`** — the single source of truth. One entry per manga with SEO
  metadata (title, keywords, synopsis), author/publisher, `status`
  (`live` | `coming-soon`) and `imageBase` (its colored-page CDN). Routes,
  sitemap and the data layer all read from here.
- **`data/manga/<slug>/`** — baked catalog per manga: `index.json` +
  `chapters/<n>.json`. Every available chapter or volume is a static SSG page,
  and its manifest records whether that unit is color, partial, or black & white.
- Page images live in per-series GitHub archives served through **jsDelivr**.
  The app never bundles reader images. Every public `imageBase` is pinned to an
  immutable 40-character commit SHA so a deployed page cannot change underneath
  an indexed URL.
- Publisher and source links record asset provenance only; provenance is not a
  license grant or a representation of licensing rights.

### Routes

| Path | Purpose |
|------|---------|
| `/` | Hub — previews every manga (live + coming-soon) |
| `/[manga]` | Manga landing (live: full reader entry; coming-soon: SEO page) |
| `/[manga]/chapters` | Full chapter list grouped by saga |
| `/[manga]/latest` | Newest-first chapter feed |
| `/[manga]/chapter/[n]` | Reader (zoom/pan, keyboard nav) |
| `/[manga]/volume/[n]` | Reader for volume-based editions |

`dynamicParams = false` on manga routes → only registered slugs render; anything
else 404s. Legacy `/read/:n` and `/chapters` 301-redirect to the One Piece paths.

## SEO

- Per-manga + per-unit `<title>`/description/keywords. Unit claims are derived
  from the baked manifest: color pages target color queries, while B&W pages
  are described only as black & white.
- JSON-LD: WebSite + SearchAction + CollectionPage (hub), ComicSeries (manga),
  ComicIssue + BreadcrumbList (chapter). Canonicals, OpenGraph/Twitter.
- Dynamic `sitemap.xml` (hub + every manga page + chapters/latest + all chapter
  reader URLs) and `robots.txt`.
- **Coming-soon manga** have crawlable, `noindex` landing pages and flip to live,
  indexable readers when manifests land — no thin chapter URLs are generated.

## Adding a manga edition

1. Drop `data/manga/<slug>/index.json` + `chapters/<n>.json` into place.
2. In `lib/manga.ts`, set that manga's `status: "live"`, its honest aggregate
   `color` coverage, and an immutable per-series `imageBase`.
3. `pnpm build` — its landing, chapters, latest and every chapter page become
   static + enter the sitemap automatically.

## Deploy note (Vercel domains)

The hub must be served at the **apex**. In Vercel set `colorizedmangas.com` as
the primary domain (serving the app), and make `onepiece.colorizedmangas.com`
either redirect to `colorizedmangas.com/one-piece` or remove it — do **not**
keep the old "apex → onepiece subdomain" redirect, or the hub is unreachable.
Set `NEXT_PUBLIC_SITE_URL=https://colorizedmangas.com` in the project env.

## Dev

```
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
```
