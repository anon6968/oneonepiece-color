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
  `chapters/<n>.json` (generated from the PDF conversion). Every chapter is a
  static SSG page. Currently only `one-piece` is populated.
- Page images live in a separate GitHub repo (`anon6968/op-color-pages`) served
  through **jsDelivr**. The app never bundles images. Image base is per-manga
  (env override for One Piece via `NEXT_PUBLIC_IMAGE_BASE`).

### Routes

| Path | Purpose |
|------|---------|
| `/` | Hub — previews every manga (live + coming-soon) |
| `/[manga]` | Manga landing (live: full reader entry; coming-soon: SEO page) |
| `/[manga]/chapters` | Full chapter list grouped by saga |
| `/[manga]/latest` | Newest-first chapter feed |
| `/[manga]/chapter/[n]` | Reader (zoom/pan, keyboard nav) |

`dynamicParams = false` on manga routes → only registered slugs render; anything
else 404s. Legacy `/read/:n` and `/chapters` 301-redirect to the One Piece paths.

## SEO

- Per-manga + per-chapter `<title>`/description/keywords targeting
  "colorized <manga> manga", "<manga> chapter N colored", "latest <manga>
  colored chapter", arc/saga names.
- JSON-LD: WebSite + SearchAction + CollectionPage (hub), ComicSeries (manga),
  ComicIssue + BreadcrumbList (chapter). Canonicals, OpenGraph/Twitter.
- Dynamic `sitemap.xml` (hub + every manga page + chapters/latest + all chapter
  reader URLs) and `robots.txt`.
- **Coming-soon manga** get real, indexable landing pages (synopsis + status) so
  they capture "colorized <manga> manga" search traffic now, then flip to a live
  reader when images land — no thin auto-generated chapter URLs until then.

## Adding a colorized manga

1. Drop `data/manga/<slug>/index.json` + `chapters/<n>.json` into place.
2. In `lib/manga.ts`, set that manga's `status: "live"` and `imageBase` to its
   colored-page CDN.
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
