import type { NextConfig } from "next";

// Colored pages are immutable once published — the content of
// /<manga>/chapter/<n> never changes, and any real update (new chapter,
// re-colored page) ships as a new deploy, which purges Vercel's CDN cache.
// So we tell the edge to hold these pages for a long time and serve stale
// while revalidating. This keeps repeat/crawler traffic on the CDN (cheap
// edge cache hits) instead of falling through to Vercel's prerender store on
// every request — which is billed as an ISR read. Applied to the reader and
// listing routes, which are ~all of the site's ~6k prerendered pages.
const IMMUTABLE_CONTENT_CACHE =
  "public, max-age=0, s-maxage=31536000, stale-while-revalidate=604800";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:manga/chapter/:n",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CONTENT_CACHE }],
      },
      {
        source: "/:manga/volume/:n",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CONTENT_CACHE }],
      },
      {
        source: "/:manga/chapters",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CONTENT_CACHE }],
      },
      {
        source: "/:manga/volumes",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CONTENT_CACHE }],
      },
      {
        source: "/:manga/latest",
        headers: [{ key: "Cache-Control", value: IMMUTABLE_CONTENT_CACHE }],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy One-Piece-only URLs → new multi-manga structure.
      { source: "/read/:n", destination: "/one-piece/chapter/:n", permanent: true },
      { source: "/chapters", destination: "/one-piece/chapters", permanent: true },
      // Naruto is served per-volume — send chapter-style URLs to volume routes.
      { source: "/naruto/chapter/:n", destination: "/naruto/volume/:n", permanent: true },
      { source: "/naruto/chapters", destination: "/naruto/volumes", permanent: true },
    ];
  },
};

export default nextConfig;
