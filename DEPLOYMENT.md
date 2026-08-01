# Deployment & Architecture — colorizedmangas.com

**Last updated: 2026-08-01. This supersedes any Vercel-based deploy instructions.**

## TL;DR
- **The live site is hosted on Cloudflare Pages** (project `colorizedmanga-web`), served from Cloudflare's edge. **Vercel is no longer in the serving path** (kept only as a cold rollback).
- **To deploy:** run **`tools/deploy_pages.sh "note"`** from the workspace root. That's it — it builds, strips prefetch files, and uploads to Pages. Pages deploys are atomic and instantly live (no cache purge needed).
- **Do NOT** rely on `git push` → Vercel for the live site anymore. A Vercel deploy no longer changes what users see (the domain points at Pages).

## Serving architecture (end to end)
```
Visitor → Cloudflare edge (DNS + CDN + cache)
            │   apex CNAME colorizedmangas.com → colorizedmanga-web.pages.dev (proxied)
            ▼
         Cloudflare Pages  ← the static site lives here (this repo's `out/`, minus prefetch files)
Manga page images         → GitHub repos → jsDelivr CDN (cdn.jsdelivr.net) — NOT on Pages
```
- **Site**: Next.js `output: "export"` → ~13k static HTML pages. Portable; no server at runtime.
- **Images**: every reader page image is on `cdn.jsdelivr.net/gh/anon6968/*-color-pages` (free, unlimited) — never touches Pages.
- **DNS / CDN / SSL / analytics / email**: all Cloudflare (zone `473309268dc0b0b9dcdd641d4ec83945`).

## How to deploy
```bash
# from the workspace root (has state/secrets.env with CF_API_TOKEN + CF_ACCOUNT_ID)
tools/deploy_pages.sh "what changed"
```
The script (`tools/deploy_pages.sh`):
1. `pnpm build` → static export in `web/out/`.
2. **Strips Next.js prefetch `.txt` files** into `web/.pages-out/` (see next section).
3. Aborts if file count ≥ 20,000 (the Pages hard limit).
4. `wrangler pages deploy` → live instantly.

## ⚠️ The 20,000-file limit (critical — don't remove the strip step)
Cloudflare Pages allows **max 20,000 files per deployment**. Next's app router emits ~116k prefetch `.txt` files (RSC payloads for instant client-side navigation), which would blow past the limit. The deploy script **deletes them** (`__next*` and every `foo.txt` that has a sibling `foo.html`), leaving ~13,100 files (HTML + assets + `sitemap.xml` / `robots.txt` / `llms.txt` / IndexNow key).

**Consequences of stripping — verified safe:**
- **SEO: unaffected.** Crawlers read the `.html`; the `.txt` files are never crawled. Same URLs, canonicals, sitemap, and hard-404 behavior.
- **UX: internal link clicks do a full-page load** (fast, from the edge) instead of an instant in-app transition. All buttons/links/reader navigation work; browser console shows harmless prefetch 404s.
- **We are at ~13k of the 20k ceiling.** Adding lots more series/chapters could approach it — the script aborts if it does. Past that, switch to R2-backed serving (store files in R2, serve via a Worker).

## SEO invariants (must always hold — this is priority #1)
- **Non-existent URLs return a hard `404`** (Pages serves `out/404.html` with 404 status). Never a soft-200.
- **The sitemap (`/sitemap.xml`, ~12,973 URLs) contains only real, indexable pages.** Coming-soon/`color:none` series are `noindex` and excluded. `logo-lab` is excluded + robots-disallowed.
- **Absolute canonicals** to `https://colorizedmangas.com`. Redirects via `public/_redirects`. Cache headers via `public/_headers` (both natively read by Pages).
- After any deploy, sanity-check: `curl -sI https://colorizedmangas.com/one-piece/chapter/1` → 200, and `curl -sI https://colorizedmangas.com/nonexistent` → 404.

## DNS (Cloudflare zone)
- `colorizedmangas.com` → CNAME (flattened) → `colorizedmanga-web.pages.dev`, proxied.
- `www.colorizedmangas.com` → CNAME → `colorizedmanga-web.pages.dev`, proxied.
- Both domains are attached to the `colorizedmanga-web` Pages project.

## Rollback (if a Pages deploy breaks something)
- **Fastest:** Cloudflare → Workers & Pages → `colorizedmanga-web` → Deployments → roll back to a previous deployment (atomic).
- **Full fallback to Vercel:** the Vercel project `oneonepiece-color` still builds from git and is intact. Repoint DNS: set apex `colorizedmangas.com` back to `A 64.29.17.1` + `A 216.198.79.1` (Vercel, proxied) and www CNAME → `cname.vercel-dns.com`.

## Other properties (not the main site)
- **Admin stats dashboard**: `colorized-stats.pages.dev` (Pages project `colorized-stats`, uses a Pages Function for live Cloudflare analytics). Source in `stats-dashboard/`. Access key gate.
- **British sister site**: `colourisedmanga.com` (Vercel project `colourisedmanga`, tiny static site). Source in `colourised-site/`.

## Cost
Cloudflare Pages = **$0 at any traffic level** (unlimited requests + bandwidth). jsDelivr images = $0. Only ongoing cost is the domain (~$15/yr, Njalla). Commercial use (ads) is allowed on Cloudflare — unlike Vercel Hobby.
