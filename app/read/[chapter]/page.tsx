import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getChapter, getChapterNumbers, getIndex, neighbours } from "@/lib/data";
import { SITE, pageUrl } from "@/lib/site";
import Reader from "./Reader";

export const dynamicParams = true;

export function generateStaticParams() {
  return getChapterNumbers().map((n) => ({ chapter: String(n) }));
}

function parse(chapter: string) {
  const n = Number(chapter);
  return Number.isInteger(n) && n > 0 ? n : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}): Promise<Metadata> {
  const { chapter } = await params;
  const n = parse(chapter);
  if (n === null) return { title: "Chapter not found" };
  const ch = getChapter(n);
  if (!ch) return { title: `One Piece Color — Chapter ${n}`, robots: { index: false } };

  const title = `One Piece Color Chapter ${n}${ch.arc ? `: ${ch.arc}` : ""} — Read in Full Color`;
  const description = `Read One Piece Chapter ${n} in full color online free${
    ch.arc ? ` (${ch.arc} arc, ${ch.saga} saga)` : ""
  }. ${ch.pageCount} digitally colored HD pages with zoom. The colorized One Piece manga.`;
  const cover = pageUrl(n, 1);

  return {
    title,
    description,
    keywords: [
      `one piece color chapter ${n}`,
      `one piece colored chapter ${n}`,
      `read one piece chapter ${n} color`,
      `one piece ${ch.arc} color`,
      "colorized one piece manga",
    ],
    alternates: { canonical: `/read/${n}` },
    openGraph: {
      type: "article",
      url: `${SITE.url}/read/${n}`,
      title,
      description,
      images: [{ url: cover, alt: `One Piece Chapter ${n} colored cover` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [cover] },
  };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const n = parse(chapter);
  if (n === null) notFound();
  const ch = getChapter(n);
  if (!ch) notFound();

  const { prev, next } = neighbours(n);
  const idx = getIndex();
  const total = idx.length ? idx[idx.length - 1].chapter : n;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ComicIssue",
        name: `One Piece Color Chapter ${n}${ch.arc ? `: ${ch.arc}` : ""}`,
        issueNumber: n,
        url: `${SITE.url}/read/${n}`,
        inLanguage: "en",
        image: pageUrl(n, 1),
        isPartOf: {
          "@type": "ComicSeries",
          name: "One Piece (Colored Edition)",
          url: SITE.url,
        },
        author: { "@type": "Person", name: "Eiichiro Oda" },
        publisher: { "@type": "Organization", name: "Shueisha" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: "Chapters", item: `${SITE.url}/chapters` },
          {
            "@type": "ListItem",
            position: 3,
            name: `Chapter ${n}`,
            item: `${SITE.url}/read/${n}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* SEO/crawlable heading + breadcrumb (visually compact) */}
      <div className="sr-only">
        <nav aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/chapters">Chapters</Link> / Chapter {n}
        </nav>
        <h1>
          One Piece Color Manga — Chapter {n}
          {ch.arc ? `: ${ch.arc}` : ""} ({ch.saga} saga)
        </h1>
        <p>
          Read One Piece chapter {n} in full color online free. {ch.pageCount} colorized pages.
        </p>
      </div>

      <Reader
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
