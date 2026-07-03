// Shared implementation for the reader routes:
//   /[manga]/chapter/[n]  (unit = "chapter")
//   /[manga]/volume/[n]   (unit = "volume")
// Each thin route file delegates here so chapter- and volume-based series get
// identical behavior with unit-correct URLs, labels and structured data.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManga, getMangaSlugs, isLive, type Manga, type MangaUnit } from "@/lib/manga";
import { getChapter, getChapterNumbers, getIndex, neighbours } from "@/lib/data";
import {
  SITE,
  listPath,
  mangaPath,
  pageUrl,
  readPath,
  unitLabel,
  unitLabelLower,
  unitLabelPlural,
  unitMetaTitle,
  unitTitle,
} from "@/lib/site";
import Reader from "@/components/Reader";

export function unitStaticParams(unit: MangaUnit) {
  const params: { manga: string; n: string }[] = [];
  for (const slug of getMangaSlugs()) {
    const m = getManga(slug);
    if (!m || !isLive(m) || m.unit !== unit) continue;
    for (const n of getChapterNumbers(slug)) {
      params.push({ manga: slug, n: String(n) });
    }
  }
  return params;
}

function parse(n: string) {
  const v = Number(n);
  return Number.isInteger(v) && v > 0 ? v : null;
}

function resolve(unit: MangaUnit, slug: string, raw: string) {
  const m = getManga(slug);
  const n = parse(raw);
  if (!m || m.unit !== unit || n === null) return null;
  return { m, n };
}

export async function buildUnitMetadata(
  unit: MangaUnit,
  params: Promise<{ manga: string; n: string }>,
): Promise<Metadata> {
  const { manga: slug, n: raw } = await params;
  const r = resolve(unit, slug, raw);
  if (!r) return { title: "Not found", robots: { index: false } };
  const { m, n } = r;
  const ch = getChapter(slug, n);
  if (!ch) return { title: `${m.title} ${unitLabel(m)} ${n}`, robots: { index: false } };

  const u = unitLabelLower(m);
  const title = unitMetaTitle(m, n, ch.arc, ch.title);
  const description = `Read ${m.title} ${unitLabel(m)} ${n}${
    ch.title ? ` (${ch.title})` : ""
  } in full color online free${
    ch.arc && ch.arc !== m.title ? ` — ${ch.arc}${ch.saga !== ch.arc ? `, ${ch.saga}` : ""}` : ""
  }. ${ch.pageCount} digitally colored HD pages with zoom — the colorized ${m.title} manga.`;
  const cover = pageUrl(m, n, 1);

  return {
    title,
    description,
    keywords: [
      `${m.title.toLowerCase()} ${u} ${n} colored`,
      `${m.title.toLowerCase()} color ${u} ${n}`,
      `read ${m.title.toLowerCase()} ${u} ${n} color`,
      ...(ch.title ? [`${m.title.toLowerCase()} ${ch.title.toLowerCase()} colored`] : []),
      `${m.title.toLowerCase()} ${ch.arc} colored`.toLowerCase(),
      `colorized ${m.title.toLowerCase()} manga`,
    ],
    alternates: { canonical: readPath(m, n) },
    openGraph: {
      type: "article",
      url: `${SITE.url}${readPath(m, n)}`,
      siteName: SITE.name,
      title,
      description,
      images: [{ url: cover, alt: `${m.title} ${unitLabel(m)} ${n} colored cover` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [cover] },
  };
}

export async function UnitReaderPage({
  unit,
  params,
}: {
  unit: MangaUnit;
  params: Promise<{ manga: string; n: string }>;
}) {
  const { manga: slug, n: raw } = await params;
  const r = resolve(unit, slug, raw);
  if (!r) notFound();
  const { m, n } = r;
  if (!isLive(m)) notFound();
  const ch = getChapter(slug, n);
  if (!ch) notFound();

  const { prev, next } = neighbours(slug, n);
  const idx = getIndex(slug);
  const total = idx.length ? idx[idx.length - 1].chapter : n;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      unit === "volume"
        ? {
            "@type": "PublicationVolume",
            name: unitTitle(m, n, ch.arc, ch.title),
            volumeNumber: n,
            url: `${SITE.url}${readPath(m, n)}`,
            inLanguage: "en",
            image: pageUrl(m, n, 1),
            isPartOf: {
              "@type": "ComicSeries",
              name: `${m.title} (Colored Edition)`,
              url: `${SITE.url}${mangaPath(slug)}`,
            },
            author: { "@type": "Person", name: m.author },
            publisher: { "@type": "Organization", name: m.publisher },
          }
        : {
            "@type": "ComicIssue",
            name: unitTitle(m, n, ch.arc, ch.title),
            issueNumber: n,
            url: `${SITE.url}${readPath(m, n)}`,
            inLanguage: "en",
            image: pageUrl(m, n, 1),
            isPartOf: {
              "@type": "ComicSeries",
              name: `${m.title} (Colored Edition)`,
              url: `${SITE.url}${mangaPath(slug)}`,
            },
            author: { "@type": "Person", name: m.author },
            publisher: { "@type": "Organization", name: m.publisher },
          },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: m.title, item: `${SITE.url}${mangaPath(slug)}` },
          {
            "@type": "ListItem",
            position: 3,
            name: unitLabel(m) + "s",
            item: `${SITE.url}${listPath(m)}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `${unitLabel(m)} ${n}`,
            item: `${SITE.url}${readPath(m, n)}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Crawlable heading + breadcrumb (visually compact) */}
      <div className="sr-only">
        <nav aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href={mangaPath(slug)}>{m.title}</Link> /{" "}
          <Link href={listPath(m)}>{unitLabel(m)}s</Link> / {unitLabel(m)} {n}
        </nav>
        <h1>
          {m.title} Color Manga — {unitLabel(m)} {n}
          {ch.title ? `: ${ch.title}` : ch.arc && ch.arc !== m.title ? `: ${ch.arc}` : ""}
          {ch.saga && ch.saga !== ch.arc ? ` (${ch.saga})` : ""}
        </h1>
        <p>
          Read {m.title} {unitLabelLower(m)} {n} in full color online free. {ch.pageCount}{" "}
          colorized pages.
        </p>
      </div>

      <Reader
        manga={m}
        chapter={n}
        arc={ch.arc}
        saga={ch.saga}
        unitTitle={ch.title}
        type={ch.type}
        pages={ch.pages}
        prev={prev}
        next={next}
        total={total}
        totalUnits={idx.length}
      />
    </>
  );
}