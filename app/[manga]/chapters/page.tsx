import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManga, getMangaSlugs, isLive } from "@/lib/manga";
import { getIndex, stats } from "@/lib/data";
import { SITE, chaptersPath, mangaPath } from "@/lib/site";
import ChapterBrowser from "@/components/ChapterBrowser";

export const dynamicParams = false;

export function generateStaticParams() {
  return getMangaSlugs().map((manga) => ({ manga }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ manga: string }>;
}): Promise<Metadata> {
  const { manga: slug } = await params;
  const m = getManga(slug);
  if (!m) return { title: "Not found" };
  const title = `All ${m.title} Color Manga Chapters — Full Chapter List`;
  const description = `Complete list of every colorized ${m.title} manga chapter, organized by saga and arc. Jump to any chapter of ${m.title} in full color.`;
  return {
    title,
    description,
    keywords: [
      `${m.title.toLowerCase()} color manga chapters`,
      `${m.title.toLowerCase()} colored chapter list`,
      `all ${m.title.toLowerCase()} chapters color`,
      `colorized ${m.title.toLowerCase()} manga`,
    ],
    alternates: { canonical: chaptersPath(slug) },
    robots: isLive(m) ? undefined : { index: false },
  };
}

export default async function ChaptersPage({
  params,
}: {
  params: Promise<{ manga: string }>;
}) {
  const { manga: slug } = await params;
  const m = getManga(slug);
  if (!m) notFound();

  const index = getIndex(slug);
  const s = stats(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: m.title, item: `${SITE.url}${mangaPath(slug)}` },
      { "@type": "ListItem", position: 3, name: "Chapters", item: `${SITE.url}${chaptersPath(slug)}` },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-2 text-xs text-mute" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="px-1">/</span>
        <Link href={mangaPath(slug)} className="hover:text-brand">{m.title}</Link>
        <span className="px-1">/</span> Chapters
      </nav>
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
        All {m.title} color manga chapters
      </h1>

      {isLive(m) && index.length > 0 ? (
        <>
          <p className="mt-2 max-w-2xl text-sm text-mute">
            Every colorized chapter we host — {s.colored} chapters in color, up to chapter {s.last},
            grouped by saga. Tap any cover to start reading.
          </p>
          <div className="mt-6">
            <ChapterBrowser manga={m} chapters={index} />
          </div>
        </>
      ) : (
        <p className="mt-4 max-w-2xl text-sm text-mute">
          The colorized {m.title} manga is being prepared — chapters will be listed here as they are
          colored.{" "}
          <Link href={mangaPath(slug)} className="text-brand hover:underline">
            See the {m.title} preview →
          </Link>
        </p>
      )}
    </div>
  );
}
