import type { Metadata } from "next";
import Link from "@/components/StaticLink";
import { notFound } from "next/navigation";
import { getManga, getMangaSlugs, isLive } from "@/lib/manga";
import { getIndex, stats } from "@/lib/data";
import {
  SITE,
  latestPath,
  listPath,
  mangaPath,
  pageUrl,
  readPath,
  unitLabel,
  unitLabelPlural,
} from "@/lib/site";
import { latestPresentation, unitPresentation } from "@/lib/unit-presentation";

export const dynamicParams = false;

export function generateStaticParams() {
  // Exclude franchise hubs (JoJo) — they group Parts and have no chapters, so
  // no /latest page is built for them.
  return getMangaSlugs()
    .filter((slug) => !getManga(slug)?.parts)
    .map((manga) => ({ manga }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ manga: string }>;
}): Promise<Metadata> {
  const { manga: slug } = await params;
  const m = getManga(slug);
  if (!m) return { title: "Not found" };
  const s = stats(slug);
  const presentation = latestPresentation({
    mangaTitle: m.title,
    unitLabel: unitLabel(m),
    aggregate: m.color,
    totalUnits: s.total,
    coloredUnits: s.colored,
    partialUnits: s.partial,
    bwUnits: s.bw,
    lastUnit: s.last,
  });
  return {
    title: presentation.title,
    description: presentation.description,
    keywords: presentation.keywords,
    alternates: { canonical: latestPath(slug) },
    robots: isLive(m) ? undefined : { index: false },
  };
}

export default async function LatestPage({
  params,
}: {
  params: Promise<{ manga: string }>;
}) {
  const { manga: slug } = await params;
  const m = getManga(slug);
  if (!m) notFound();

  const index = getIndex(slug);
  const s = stats(slug);
  const latest = [...index].reverse();
  const label = unitLabel(m);
  const plural = unitLabelPlural(m);
  const presentation = latestPresentation({
    mangaTitle: m.title,
    unitLabel: label,
    aggregate: m.color,
    totalUnits: s.total,
    coloredUnits: s.colored,
    partialUnits: s.partial,
    bwUnits: s.bw,
    lastUnit: s.last,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: m.title, item: `${SITE.url}${mangaPath(slug)}` },
      { "@type": "ListItem", position: 3, name: "Latest", item: `${SITE.url}${latestPath(slug)}` },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-2 text-xs text-mute" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="px-1">/</span>
        <Link href={mangaPath(slug)} className="hover:text-brand">{m.title}</Link>
        <span className="px-1">/</span> Latest
      </nav>
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
        {presentation.heading}
      </h1>

      {isLive(m) && latest.length > 0 ? (
        <>
          <p className="mt-2 text-sm text-mute">
            {presentation.copy}{" "}
            <Link href={listPath(m)} className="text-brand hover:underline">
              Browse the full list by arc →
            </Link>
          </p>
          <ol className="mt-6 divide-y divide-line/40 overflow-hidden rounded-xl bg-panel/40">
            {latest.map((c) => {
              const item = unitPresentation({
                mangaTitle: m.title,
                unitLabel: label,
                unitNumber: c.chapter,
                pageCount: c.pageCount,
                type: c.type,
                chapterTitle: c.title,
                arc: c.arc,
                saga: c.saga,
              });
              return <li key={c.chapter}>
                <Link
                  href={readPath(m, c.chapter)}
                  prefetch={false}
                  className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-panel"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pageUrl(m, c.chapter, 1)}
                    alt={item.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-10 flex-none rounded object-cover object-top bg-ink-2"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">
                      {m.title} {label} {c.chapter}
                      {c.title && <span className="text-mute"> — {c.title}</span>}
                      {c.type === "partial" && (
                        <span className="ml-2 rounded bg-gold/90 px-1 py-0.5 text-[10px] font-bold text-ink">
                          PARTIAL
                        </span>
                      )}
                      {c.type === "bw" && (
                        <span className="ml-2 rounded bg-bone/20 px-1 py-0.5 text-[10px] font-bold text-bone ring-1 ring-white/10">
                          B&amp;W
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-mute">
                      {c.arc === c.saga ? c.arc : `${c.arc} · ${c.saga}`} · {c.pageCount} pages
                    </div>
                  </div>
                  <span className="flex-none text-xs font-semibold text-brand">Read →</span>
                </Link>
              </li>;
            })}
          </ol>
        </>
      ) : (
        <p className="mt-4 text-sm text-mute">
          The colorized {m.title} manga is being prepared — the latest colored {plural} will appear
          here first.{" "}
          <Link href={mangaPath(slug)} className="text-brand hover:underline">
            See the {m.title} preview →
          </Link>
        </p>
      )}
    </div>
  );
}
