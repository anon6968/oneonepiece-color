import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManga, getMangaSlugs, isLive, liveMangas, type Manga } from "@/lib/manga";
import { getIndex, stats } from "@/lib/data";
import {
  SITE,
  mangaPath,
  pageUrl,
  unitLabel,
  unitLabelPlural,
} from "@/lib/site";
import ChapterBrowser from "@/components/ChapterBrowser";
import MangaCard from "@/components/MangaCard";
import MangaInfoPanel from "@/components/MangaInfoPanel";

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

  const live = isLive(m);
  const plural = unitLabelPlural(m);
  const title = live
    ? `${m.title} Colored Manga — Read ${m.title} in Full Color Online Free`
    : `${m.title} Colored Manga — Colorized ${m.title} (Coming Soon)`;
  const description = live
    ? `Read the colorized ${m.title} manga online for free. Every ${unitLabel(m).toLowerCase()} of ${m.author}'s ${m.title} digitally colored in full HD, with a fast mobile reader and zoom. ${m.tagline}`
    : `The colorized ${m.title} manga is coming soon — every chapter of ${m.author}'s ${m.title} digitally colored in full HD. ${m.tagline} Read our live colorized series while ${m.title} is colorized.`;

  const ogImages = live
    ? [{ url: pageUrl(m, getIndex(slug)[0]?.chapter ?? 1, 1), alt: `${m.title} colored manga cover` }]
    : undefined;

  return {
    title,
    description,
    keywords: [...m.keywords, `${m.title.toLowerCase()} colored ${plural}`],
    alternates: { canonical: mangaPath(slug) },
    openGraph: {
      type: "website",
      url: `${SITE.url}${mangaPath(slug)}`,
      siteName: SITE.name,
      title,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages?.map((i) => i.url),
    },
  };
}

export default async function MangaPage({
  params,
}: {
  params: Promise<{ manga: string }>;
}) {
  const { manga: slug } = await params;
  const m = getManga(slug);
  if (!m) notFound();

  return isLive(m) ? <LiveManga m={m} /> : <ComingSoonManga m={m} />;
}

/* --------------------------------- LIVE --------------------------------- */

function LiveManga({ m }: { m: Manga }) {
  const index = getIndex(m.slug);
  const s = stats(m.slug);
  const firstCh = index[0]?.chapter ?? 1;
  const plural = unitLabelPlural(m);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ComicSeries",
        "@id": `${SITE.url}${mangaPath(m.slug)}#series`,
        name: `${m.title} (Colored / Digital Color Edition)`,
        alternateName: m.altTitles,
        url: `${SITE.url}${mangaPath(m.slug)}`,
        genre: m.genres,
        author: { "@type": "Person", name: m.author },
        publisher: { "@type": "Organization", name: m.publisher },
        numberOfEpisodes: s.total,
        inLanguage: "en",
        description: m.synopsis,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: m.title, item: `${SITE.url}${mangaPath(m.slug)}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 2xl:max-w-[90rem]">
        <nav className="mb-4 text-xs text-mute" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="px-1.5">/</span>
          <span className="text-fg">{m.title}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(280px,36%)_1fr] lg:items-start lg:gap-10 xl:grid-cols-[minmax(300px,34%)_1fr]">
          <MangaInfoPanel manga={m} stats={s} firstChapter={firstCh} />

          <div className="min-w-0 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto lg:pr-1">
            <h2 className="sr-only">Browse all {m.title} {plural}</h2>

            {index.length > 0 ? (
              <ChapterBrowser manga={m} chapters={index} />
            ) : (
              <p className="py-12 text-center text-mute">No {plural} available yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ------------------------------ COMING SOON ----------------------------- */

function ComingSoonManga({ m }: { m: Manga }) {
  const others = liveMangas();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ComicSeries",
        name: `${m.title} (Colored Edition)`,
        alternateName: m.altTitles,
        url: `${SITE.url}${mangaPath(m.slug)}`,
        genre: m.genres,
        author: { "@type": "Person", name: m.author },
        publisher: { "@type": "Organization", name: m.publisher },
        inLanguage: "en",
        description: m.synopsis,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          { "@type": "ListItem", position: 2, name: m.title, item: `${SITE.url}${mangaPath(m.slug)}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="mx-auto max-w-3xl px-4 py-16 sm:py-24">
        <nav className="mb-4 text-xs text-mute" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand">Home</Link>
          <span className="px-1.5">/</span>
          <span className="text-fg">{m.title}</span>
        </nav>

        <span className="inline-flex items-center gap-2 rounded-full bg-panel/70 px-3 py-1 text-xs text-mute">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Colorization in progress
        </span>

        <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
          The colorized <span className="text-brand">{m.title}</span> manga is coming
        </h1>
        <p className="mt-5 text-base leading-relaxed text-mute sm:text-lg">{m.synopsis}</p>

        <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Author", m.author],
            ["Publisher", m.publisher],
            ["Since", String(m.year)],
            ["Chapters", m.totalChapters ? `~${m.totalChapters}` : "—"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl bg-panel p-3">
              <dt className="text-[11px] uppercase tracking-wide text-mute">{k}</dt>
              <dd className="mt-1 text-sm font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 rounded-2xl bg-panel/50 p-5">
          <p className="text-sm text-mute">
            Every chapter of {m.title} is being digitally colored in full HD and will appear here
            as pages are finished. In the meantime, {others.length} complete colorized series are
            ready to read.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={mangaPath(o.slug)}
                className="rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
              >
                Read {o.title} in color →
              </Link>
            ))}
            <Link
              href="/#library"
              className="rounded-xl bg-panel px-5 py-2.5 text-sm font-semibold hover:bg-panel-2"
            >
              See all manga
            </Link>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <h2 className="mb-5 text-xl font-bold">Available now in full color</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {others.map((o) => (
              <MangaCard key={o.slug} manga={o} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
