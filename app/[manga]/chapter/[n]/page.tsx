import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManga, getMangaSlugs, isLive } from "@/lib/manga";
import { getChapter, getChapterNumbers, getIndex, neighbours } from "@/lib/data";
import { SITE, chapterMetaTitle, chapterTitle, chapterPath, chaptersPath, mangaPath, pageUrl } from "@/lib/site";
import Reader from "./Reader";

export const dynamicParams = false;

export function generateStaticParams() {
  const params: { manga: string; n: string }[] = [];
  for (const slug of getMangaSlugs()) {
    const m = getManga(slug);
    if (!m || !isLive(m)) continue;
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ manga: string; n: string }>;
}): Promise<Metadata> {
  const { manga: slug, n: raw } = await params;
  const m = getManga(slug);
  const n = parse(raw);
  if (!m || n === null) return { title: "Chapter not found" };
  const ch = getChapter(slug, n);
  if (!ch) return { title: `${m.title} Chapter ${n}`, robots: { index: false } };

  const title = chapterMetaTitle(m, n, ch.arc);
  const description = `Read ${m.title} Chapter ${n} in full color online free${
    ch.arc ? ` (${ch.arc} arc, ${ch.saga} saga)` : ""
  }. ${ch.pageCount} digitally colored HD pages with zoom — the colorized ${m.title} manga.`;
  const cover = pageUrl(m, n, 1);

  return {
    title,
    description,
    keywords: [
      `${m.title.toLowerCase()} chapter ${n} colored`,
      `${m.title.toLowerCase()} color chapter ${n}`,
      `read ${m.title.toLowerCase()} chapter ${n} color`,
      `${m.title.toLowerCase()} ${ch.arc} colored`.toLowerCase(),
      `colorized ${m.title.toLowerCase()} manga`,
    ],
    alternates: { canonical: chapterPath(slug, n) },
    openGraph: {
      type: "article",
      url: `${SITE.url}${chapterPath(slug, n)}`,
      title,
      description,
      images: [{ url: cover, alt: `${m.title} Chapter ${n} colored cover` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [cover] },
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ manga: string; n: string }>;
}) {
  const { manga: slug, n: raw } = await params;
  const m = getManga(slug);
  const n = parse(raw);
  if (!m || !isLive(m) || n === null) notFound();
  const ch = getChapter(slug, n);
  if (!ch) notFound();

  const { prev, next } = neighbours(slug, n);
  const idx = getIndex(slug);
  const total = idx.length ? idx[idx.length - 1].chapter : n;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ComicIssue",
        name: chapterTitle(m, n, ch.arc),
        issueNumber: n,
        url: `${SITE.url}${chapterPath(slug, n)}`,
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
          { "@type": "ListItem", position: 3, name: "Chapters", item: `${SITE.url}${chaptersPath(slug)}` },
          { "@type": "ListItem", position: 4, name: `Chapter ${n}`, item: `${SITE.url}${chapterPath(slug, n)}` },
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
          <Link href={chaptersPath(slug)}>Chapters</Link> / Chapter {n}
        </nav>
        <h1>
          {m.title} Color Manga — Chapter {n}
          {ch.arc ? `: ${ch.arc}` : ""} ({ch.saga} saga)
        </h1>
        <p>
          Read {m.title} chapter {n} in full color online free. {ch.pageCount} colorized pages.
        </p>
      </div>

      <Reader
        manga={m}
        chapter={n}
        arc={ch.arc}
        saga={ch.saga}
        type={ch.type}
        pages={ch.pages}
        prev={prev}
        next={next}
        total={total}
      />
    </>
  );
}
