import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManga, getMangaSlugs, isLive, liveMangas, type Manga } from "@/lib/manga";
import { getIndex, groupBySaga, sagaSlug, stats } from "@/lib/data";
import {
  SITE,
  chapterPath,
  chaptersPath,
  latestPath,
  mangaPath,
} from "@/lib/site";
import ChapterCard from "@/components/ChapterCard";
import ChapterJump from "@/components/ChapterJump";
import MangaCard from "@/components/MangaCard";

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
  const title = live
    ? `${m.title} Colored Manga — Read ${m.title} in Full Color Online Free`
    : `${m.title} Colored Manga — Colorized ${m.title} (Coming Soon)`;
  const description = live
    ? `Read the colorized ${m.title} manga online for free. Every chapter of ${m.author}'s ${m.title} digitally colored in full HD, with a fast mobile reader and zoom. ${m.tagline}`
    : `The colorized ${m.title} manga is coming soon — every chapter of ${m.author}'s ${m.title} digitally colored in full HD. ${m.tagline} Read One Piece in color now while ${m.title} is colorized.`;

  return {
    title,
    description,
    keywords: m.keywords,
    alternates: { canonical: mangaPath(slug) },
    openGraph: {
      type: "website",
      url: `${SITE.url}${mangaPath(slug)}`,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
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
  const sagas = groupBySaga(m.slug);
  const latest = [...index].reverse().slice(0, 12);
  const first = index.slice(0, 6);
  const firstCh = index[0]?.chapter ?? 1;

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

      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <nav className="mb-4 text-xs text-mute" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="px-1.5">/</span>
            <span className="text-fg">{m.title}</span>
          </nav>
          <div className="animate-fadeUp">
            <span className="inline-flex items-center gap-2 rounded-full bg-panel px-3 py-1 text-xs text-mute ring-1 ring-line/60">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulseGlow" />
              {s.colored} chapters in color · updated to Ch. {s.last}
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              Read <span className="text-brand">{m.title}</span> in{" "}
              <span className="bg-gradient-to-r from-brand via-brand-2 to-gold bg-clip-text text-transparent">
                full color
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
              {m.synopsis}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={chapterPath(m.slug, firstCh)}
                className="rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:brightness-110"
              >
                Start from Chapter {firstCh} →
              </Link>
              {s.last > 0 && (
                <Link
                  href={chapterPath(m.slug, s.last)}
                  className="rounded-xl bg-panel px-5 py-3 text-sm font-semibold text-fg ring-1 ring-line/60 transition hover:bg-panel-2"
                >
                  Latest · Chapter {s.last}
                </Link>
              )}
              <Link
                href={chaptersPath(m.slug)}
                className="rounded-xl px-5 py-3 text-sm font-semibold text-mute transition hover:text-fg"
              >
                Browse all chapters
              </Link>
              <div className="ml-auto hidden sm:block">
                <ChapterJump slug={m.slug} max={s.last} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {latest.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold sm:text-2xl">Latest {m.title} color chapters</h2>
            <Link href={latestPath(m.slug)} className="text-sm text-brand hover:underline">
              See all latest →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {latest.map((c, i) => (
              <ChapterCard key={c.chapter} manga={m} c={c} priority={i < 6} />
            ))}
          </div>
        </section>
      )}

      {first.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-2">
          <h2 className="mb-5 text-xl font-bold sm:text-2xl">
            Start from the beginning · {index[0].saga}
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {first.map((c) => (
              <ChapterCard key={c.chapter} manga={m} c={c} />
            ))}
          </div>
        </section>
      )}

      {sagas.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="mb-5 text-xl font-bold sm:text-2xl">Jump to a saga</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {sagas.map((sg) => {
              const from = sg.chapters[0].chapter;
              const to = sg.chapters[sg.chapters.length - 1].chapter;
              return (
                <Link
                  key={sg.saga}
                  href={`${chaptersPath(m.slug)}#${sagaSlug(sg.saga)}`}
                  className="rounded-xl bg-panel p-4 ring-1 ring-line/50 transition hover:bg-panel-2 hover:ring-brand/40"
                >
                  <div className="font-semibold">{sg.saga}</div>
                  <div className="mt-1 text-xs text-mute">
                    Ch. {from}–{to} · {sg.chapters.length} in color
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-4 text-sm leading-relaxed text-mute">
          <h2 className="text-lg font-bold text-fg">About the {m.title} colored manga</h2>
          <p>{m.synopsis}</p>
          <p>
            We currently host {s.colored} fully colored chapters
            {sagas.length > 0 && (
              <> spanning {sagas.map((x) => x.saga).slice(0, 6).join(", ")} and beyond</>
            )}
            , up to chapter {s.last}. The reader is optimized for mobile and desktop: pages load
            fast from a global CDN, keep their aspect ratio to avoid layout shift, and every page
            supports pinch-to-zoom so you never miss a detail of the colored artwork.
          </p>
          <p>
            Whether you&apos;re starting from{" "}
            <Link href={chapterPath(m.slug, firstCh)} className="text-brand hover:underline">
              Chapter {firstCh}
            </Link>{" "}
            or catching up on the{" "}
            <Link href={latestPath(m.slug)} className="text-brand hover:underline">
              latest colored chapter
            </Link>
            , this is the fastest way to read {m.title} in color.
          </p>
        </div>
      </section>
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

        <span className="inline-flex items-center gap-2 rounded-full bg-panel px-3 py-1 text-xs text-mute ring-1 ring-line/60">
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
            <div key={k} className="rounded-xl bg-panel p-3 ring-1 ring-line/50">
              <dt className="text-[11px] uppercase tracking-wide text-mute">{k}</dt>
              <dd className="mt-1 text-sm font-semibold">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 rounded-2xl bg-panel/60 p-5 ring-1 ring-line/50">
          <p className="text-sm text-mute">
            Every chapter of {m.title} is being digitally colored in full HD and will appear here
            as pages are finished. In the meantime, the complete colorized One Piece manga is
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
              className="rounded-xl bg-panel px-5 py-2.5 text-sm font-semibold ring-1 ring-line/60 hover:bg-panel-2"
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
