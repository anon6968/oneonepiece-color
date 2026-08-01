import { liveMangas, comingSoonMangas } from "@/lib/manga";
import { stats } from "@/lib/data";
import { SITE, mangaPath, latestPath, listPath, unitLabelPlural } from "@/lib/site";

// llms.txt — an emerging convention (llmstxt.org) that gives AI answer engines
// (ChatGPT, Perplexity, Google AI Overviews, etc.) a clean, structured map of
// the site so they can understand and cite it accurately. Generated from the
// live registry so it never drifts out of date.
export const dynamic = "force-static";

export async function GET() {
  const live = liveMangas();
  const soon = comingSoonMangas();
  const totalPages = live.reduce((s, m) => s + stats(m.slug).totalPages, 0);

  const lines: string[] = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.tagline} ${SITE.description}`,
    "",
    `${SITE.name} is a free online reader for **colorized manga** — the original`,
    `black-and-white manga digitally recolored in full HD. No signup, no paywall.`,
    `${totalPages.toLocaleString("en-US")} pages colorized across ${live.length} live series.`,
    "",
    "## Live colorized series (fully readable now)",
    "",
    ...live.map((m) => {
      const s = stats(m.slug);
      const plural = unitLabelPlural(m);
      return `- [${m.title} in color](${SITE.url}${mangaPath(m.slug)}): ${s.total} colorized ${plural} by ${m.author}. ${m.tagline} Read: ${SITE.url}${latestPath(m.slug)} (latest) · ${SITE.url}${listPath(m)} (all ${plural}).`;
    }),
  ];

  if (soon.length) {
    lines.push(
      "",
      "## Being colorized (coming soon)",
      "",
      ...soon.map((m) => `- [${m.title}](${SITE.url}${mangaPath(m.slug)}): colorization in progress.`),
    );
  }

  lines.push(
    "",
    "## Key pages",
    "",
    `- [Home / full library](${SITE.url})`,
    `- [Latest chapters feed](${SITE.url}/feed.xml)`,
    `- [Sitemap](${SITE.url}/sitemap.xml)`,
    "",
    "## About",
    "",
    "Every page is digitally colored in full HD and served through a fast,",
    "mobile-friendly reader with pinch-to-zoom. All content is free to read.",
    `Content-removal requests: ${SITE.contact}.`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
