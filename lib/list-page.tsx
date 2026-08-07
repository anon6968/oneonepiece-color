// Shared implementation for the unit-listing routes:
//   /[manga]/chapters  (unit = "chapter")
//   /[manga]/volumes   (unit = "volume")

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManga, getMangaSlugs, isLive, type MangaUnit } from "@/lib/manga";
import { getIndex, stats } from "@/lib/data";
import { SITE, listPath, mangaPath, unitLabel, unitLabelPlural } from "@/lib/site";
import { listPresentation } from "@/lib/unit-presentation";
import ChapterBrowser from "@/components/ChapterBrowser";

export function listStaticParams(unit: MangaUnit) {
  return getMangaSlugs()
    .filter((slug) => {
      const m = getManga(slug);
      // Franchise hubs (JoJo) group Parts and have no chapters of their own —
      // skip their /chapters + /latest pages so no empty listing is built.
      return m?.unit === unit && !m.parts;
    })
    .map((manga) => ({ manga }));
}

export async function buildListMetadata(
  unit: MangaUnit,
  params: Promise<{ manga: string }>,
): Promise<Metadata> {
  const { manga: slug } = await params;
  const m = getManga(slug);
  if (!m || m.unit !== unit) return { title: "Not found", robots: { index: false } };
  const s = stats(slug);
  const presentation = listPresentation({
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
    alternates: { canonical: listPath(m) },
    robots: isLive(m) ? undefined : { index: false },
  };
}

export async function UnitListPage({
  unit,
  params,
}: {
  unit: MangaUnit;
  params: Promise<{ manga: string }>;
}) {
  const { manga: slug } = await params;
  const m = getManga(slug);
  if (!m || m.unit !== unit) notFound();

  const index = getIndex(slug);
  const s = stats(slug);
  const plural = unitLabelPlural(m);
  const presentation = listPresentation({
    mangaTitle: m.title,
    unitLabel: unitLabel(m),
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
      { "@type": "ListItem", position: 3, name: `${unitLabel(m)}s`, item: `${SITE.url}${listPath(m)}` },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 2xl:max-w-7xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-2 text-xs text-mute" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="px-1">/</span>
        <Link href={mangaPath(slug)} className="hover:text-brand">{m.title}</Link>
        <span className="px-1">/</span> {unitLabel(m)}s
      </nav>
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
        {presentation.heading}
      </h1>

      {isLive(m) && index.length > 0 ? (
        <>
          <p className="mt-2 max-w-2xl text-sm text-mute">
            {presentation.copy} Units are grouped by arc.
          </p>
          <div className="mt-6">
            <ChapterBrowser manga={m} chapters={index} />
          </div>
        </>
      ) : (
        <p className="mt-4 max-w-2xl text-sm text-mute">
          The colorized {m.title} manga is being prepared — {plural} will be listed here as they are
          colored.{" "}
          <Link href={mangaPath(slug)} className="text-brand hover:underline">
            See the {m.title} preview →
          </Link>
        </p>
      )}
    </div>
  );
}
