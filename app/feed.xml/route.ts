import { liveMangas } from "@/lib/manga";
import { getIndex } from "@/lib/data";
import { SITE, mangaPath, readPath, unitLabel } from "@/lib/site";

// A lightweight "latest colored chapters" feed. Feeds are still crawled by
// search engines and aggregators as a freshness + discovery signal, and this
// one surfaces the newest chapter of every live series so bots reach deep,
// recently-added reader pages without waiting for a full sitemap crawl.
export const dynamic = "force-static";

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const built = new Date().toUTCString();

  const items: string[] = [];
  for (const m of liveMangas()) {
    const idx = getIndex(m.slug);
    // Newest few units per series (highest numbers = most recently added).
    const latest = [...idx].slice(-3).reverse();
    for (const c of latest) {
      const label = unitLabel(m);
      const url = `${SITE.url}${readPath(m, c.chapter)}`;
      const title = `${m.title} ${label} ${c.chapter}${c.title ? `: ${c.title}` : ""} — in full color`;
      const desc = `Read ${m.title} ${label.toLowerCase()} ${c.chapter} colorized in full HD — ${c.pageCount} pages, free online.`;
      items.push(
        `    <item>
      <title>${xmlEscape(title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <description>${xmlEscape(desc)}</description>
      <pubDate>${built}</pubDate>
    </item>`,
      );
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xmlEscape(SITE.name)} — latest colored chapters</title>
    <link>${SITE.url}</link>
    <atom:link href="${SITE.url}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(SITE.description)}</description>
    <language>en</language>
    <lastBuildDate>${built}</lastBuildDate>
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
