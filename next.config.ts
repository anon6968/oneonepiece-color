import type { NextConfig } from "next";

// The site is fully static: every page is prerendered at build time from
// generateStaticParams (dynamicParams = false) and all page images are served
// from jsDelivr's CDN, not from here. `output: "export"` emits the whole site
// as flat .html files into out/ instead of Vercel's prerender store. Those are
// served as ordinary static assets, so they are NOT billed as ISR reads —
// eliminating the ISR metering that was the entire reason for the old
// long-cache headers below.
//
// Static export does not support next.config `headers()` / `redirects()`
// (they only run in a Node/edge server, which no longer exists). The equivalent
// host-level config now lives in:
//   - vercel.json          (redirects + cache headers on Vercel)
//   - public/_redirects    (redirects on Cloudflare Pages)
//   - public/_headers      (cache headers on Cloudflare Pages)
const nextConfig: NextConfig = {
  output: "export",
  images: {
    // No server exists to run Next's image optimizer in an exported site.
    // Only logo-lab / not-found use next/image; every reader image is a plain
    // <img> pointing at jsDelivr, so this changes nothing users see.
    unoptimized: true,
  },
};

export default nextConfig;
