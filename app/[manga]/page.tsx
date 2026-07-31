import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManga, getMangaSlugs, isLive, liveMangas, type Manga } from "@/lib/manga";
import { getIndex, stats, type MangaStats } from "@/lib/data";
import {
  SITE,
  mangaPath,
  pageUrl,
  unitLabel,
  unitLabelLower,
  unitLabelPlural,
} from "@/lib/site";
import ChapterBrowser from "@/components/ChapterBrowser";
import MangaCard from "@/components/MangaCard";
import MangaInfoPanel from "@/components/MangaInfoPanel";
import ShareButton from "@/components/ShareButton";

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
  const bw = m.color === "none";
  const plural = unitLabelPlural(m);
  const title = !live
    ? `${m.title} Colored Manga — Colorized ${m.title} (Coming Soon)`
    : bw
      ? `${m.title} Manga — Read ${m.title} Online Free (Black & White)`
      : `${m.title} Colored Manga — Read in Full Color Online Free`;
  // Keep meta descriptions ≤160 chars and non-repetitive: the per-series
  // `tagline` was being appended onto an already-complete sentence, producing
  // a duplicated ~246-char description that Google truncates.
  const description = !live
    ? `The colorized ${m.title} manga is coming soon — every chapter of ${m.author}'s ${m.title} is being digitally colored in full HD. Read our live colorized series in the meantime.`
    : bw
      ? `Read the ${m.title} manga online free in high-quality black & white — the full series by ${m.author}, every ${unitLabel(m).toLowerCase()} on a fast mobile reader.`
      : `Read the colorized ${m.title} manga online free. Every ${unitLabel(m).toLowerCase()} of ${m.author}'s ${m.title} digitally colored in full HD, on a fast mobile reader.`;

  const ogImages = m.parts
    ? [{ url: `${SITE.url}${m.poster}`, alt: `${m.title} colored manga` }]
    : live
      ? [{ url: pageUrl(m, getIndex(slug)[0]?.chapter ?? 1, 1), alt: `${m.title} manga cover` }]
      : undefined;

  return {
    title,
    description,
    keywords: [
      ...m.keywords,
      bw
        ? `${m.title.toLowerCase()} manga online free`
        : `${m.title.toLowerCase()} colored ${plural}`,
    ],
    // Coming-soon / not-yet-colored series have nothing to read. Keep them
    // out of the index (but crawlable via follow) so thin placeholder pages
    // don't dilute site quality or disappoint searchers, then flip to
    // indexable automatically the moment the series goes live. Spread the key
    // conditionally — live pages must OMIT robots entirely so they inherit the
    // layout's index/follow + googleBot max-image-preview:large directive
    // (setting robots: undefined would strip that inherited image directive).
    ...(live ? {} : { robots: { index: false, follow: true } }),
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
  if (m.parts) return <PartsHub m={m} />;

  return isLive(m) ? <LiveManga m={m} /> : <ComingSoonManga m={m} />;
}

/* ------------------------------- PARTS HUB ------------------------------ */

/** Franchise hub page (e.g. JoJo): renders the grouped Part sub-series as a
 *  grid of sections linking to their own live pages, instead of a chapter list. */
function PartsHub({ m }: { m: Manga }) {
  const parts = (m.parts ?? []).map((p) => {
    const pm = getManga(p.slug);
    const idx = pm ? getIndex(p.slug) : [];
    const s = pm ? stats(p.slug) : null;
    const cover = pm && idx[0] ? pageUrl(pm, idx[0].chapter, 1) : undefined;
    return { ...p, cover, colored: s?.colored ?? 0 };
  });

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
        inLanguage: "en",
        isAccessibleForFree: true,
        image: `${SITE.url}${m.poster}`,
        description: m.synopsis,
        hasPart: parts.map((p) => ({
          "@type": "ComicSeries",
          name: p.title,
          url: `${SITE.url}${mangaPath(p.slug)}`,
        })),
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

      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 2xl:max-w-7xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <nav className="text-xs text-mute" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="px-1.5">/</span>
            <span className="text-fg">{m.title}</span>
          </nav>
          <ShareButton title={`${m.title} in color — Colorized Manga`} />
        </div>

        <div className="grid gap-8 md:grid-cols-[minmax(200px,280px)_1fr] md:items-start md:gap-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.poster}
            alt={`${m.title} colored manga poster`}
            className="w-full max-w-[280px] rounded-2xl object-cover shadow-lg ring-1 ring-line/50"
          />
          <div className="min-w-0">
            <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              {m.title} <span className="text-brand">in full color</span>
            </h1>
            <p className="mt-2 text-sm text-mute">
              {m.author} · {parts.length} Parts · digitally colorized in HD
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-mute sm:text-base">
              {m.synopsis}
            </p>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Read {m.title} by Part</h2>
          <p className="mt-1.5 mb-6 max-w-2xl text-sm text-mute sm:text-base">
            The saga is told in self-contained Parts. Pick one to start reading in color — each opens
            its own colorized chapters.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {parts.map((p) => (
              <Link
                key={p.slug}
                href={mangaPath(p.slug)}
                prefetch={false}
                className="group overflow-hidden rounded-2xl bg-ink-2 shadow-lg shadow-black/30 ring-1 ring-line/50 transition-transform duration-300 hover:z-10 hover:scale-[1.02] hover:ring-brand/40"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-panel">
                  {p.cover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.cover}
                      alt={`${p.title} colored`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  )}
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm font-bold leading-tight sm:text-base">{p.title}</h3>
                  <p className="mt-1 text-xs text-mute">
                    {p.colored > 0 ? `${p.colored} colored chapters` : "Read in color →"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-line/40 pt-8">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            About the colorized {m.title} manga
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mute sm:text-base">
            {m.synopsis}
          </p>
        </section>
      </div>
    </>
  );
}

/* --------------------------------- LIVE --------------------------------- */

/** Per-series Q&A backing the on-page FAQ + FAQPage structured data. These map
 *  directly onto the real "is <series> available in color / where can I read
 *  it / how many colored chapters" searches that forum threads currently win. */
function seriesFaqs(m: Manga, s: MangaStats, firstCh: number) {
  const label = unitLabel(m);
  const lower = unitLabelLower(m);
  const plural = unitLabelPlural(m);
  const fan = !!m.colorNote?.toLowerCase().includes("fan");
  const bw = m.color === "none";

  if (bw) {
    return [
      {
        q: `Where can I read ${m.title} online for free?`,
        a: `Right here. The ${m.title} manga is free to read online in high-quality black & white — ${s.total} ${plural}, ${s.totalPages.toLocaleString("en-US")} pages — with no account, no app and no paywall.`,
      },
      {
        q: `Is ${m.title} available in color?`,
        a: `Not yet. There is no official full-color edition of ${m.title}, so we host the complete series in high-quality black & white instead — every ${lower} clearly labeled B&W. If an official colored ${m.title} is ever released, it will replace these pages.`,
      },
      {
        q: `How many ${plural} of ${m.title} can I read here?`,
        a: `All ${s.total} ${plural} we host are live right now — ${s.totalPages.toLocaleString("en-US")} pages of ${m.author}'s ${m.title} — with more added as they release.`,
      },
      {
        q: `Is it free to read ${m.title}?`,
        a: `Yes. Every ${lower} of ${m.title} is free to read online — no account, no app and no paywall — on a fast mobile reader with pinch-to-zoom.`,
      },
      {
        q: `Where should I start reading ${m.title}?`,
        a: `Start with ${label} ${firstCh} and use the reader's next-page controls to keep going. You can jump to any ${lower} from the ${m.title} ${plural} list.`,
      },
    ];
  }

  const availability =
    m.color === "full"
      ? `Yes. The ${m.title} manga is available in full color here — ${s.colored} ${plural} digitally colored in HD, free to read with no signup.`
      : `Partly. ${
          m.colorNote ?? `Only some ${plural} are colored so far`
        }. Those are in full color here; the rest of ${m.title} isn't colored yet.`;

  return [
    { q: `Is ${m.title} available in color?`, a: availability },
    {
      q: `How many colored ${plural} of ${m.title} are there?`,
      a: `${s.colored} colored ${plural} — ${s.totalPages.toLocaleString(
        "en-US",
      )} digitally colored pages — are live right now, with more added as they're finished.`,
    },
    {
      q: `Is it free to read ${m.title} in color?`,
      a: `Yes. Every colored ${lower} of ${m.title} is free to read online — no account, no app and no paywall.`,
    },
    {
      q: fan
        ? `Is this an official colored ${m.title}?`
        : `Is this the official colored ${m.title}?`,
      a: fan
        ? `These are high-quality fan-colored ${plural} — no official color edition of ${m.title} exists yet, so this is the closest way to read it in color.`
        : `These are digitally colored HD editions of ${m.title}, faithfully colored page by page and read in a fast mobile-friendly reader.`,
    },
    {
      q: `Where should I start reading ${m.title} in color?`,
      a: `Start with ${label} ${firstCh} and use the reader's next-page controls to keep going. You can jump to any ${lower} from the ${m.title} ${plural} list.`,
    },
  ];
}

function LiveManga({ m }: { m: Manga }) {
  const index = getIndex(m.slug);
  const s = stats(m.slug);
  const firstCh = index[0]?.chapter ?? 1;
  const plural = unitLabelPlural(m);
  const faqs = seriesFaqs(m, s, firstCh);
  const bw = m.color === "none";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${SITE.url}${mangaPath(m.slug)}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "ComicSeries",
        "@id": `${SITE.url}${mangaPath(m.slug)}#series`,
        name: bw ? m.title : `${m.title} (Colored / Digital Color Edition)`,
        alternateName: m.altTitles,
        url: `${SITE.url}${mangaPath(m.slug)}`,
        genre: m.genres,
        author: { "@type": "Person", name: m.author },
        publisher: { "@type": "Organization", name: m.publisher },
        numberOfEpisodes: s.total,
        inLanguage: "en",
        isAccessibleForFree: true,
        image: pageUrl(m, firstCh, 1),
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
        <div className="mb-4 flex items-center justify-between gap-3">
          <nav className="text-xs text-mute" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="px-1.5">/</span>
            <span className="text-fg">{m.title}</span>
          </nav>
          <ShareButton title={`${m.title} in color — Colorized Manga`} />
        </div>

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

        {/* Unique on-page editorial + FAQ. This is the crawlable body copy that
            lets the hub rank for "<series> colored manga" and the question
            queries — the forum threads that currently outrank us have none of
            this depth. */}
        <section className="mt-12 border-t border-line/40 pt-8">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            About the {bw ? "" : "colorized "}{m.title} manga
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-mute sm:text-base">
            {m.synopsis}
          </p>
        </section>

        <section
          className="mt-10 border-t border-line/40 pt-8"
          aria-labelledby={`${m.slug}-faq`}
        >
          <h2
            id={`${m.slug}-faq`}
            className="text-xl font-bold tracking-tight sm:text-2xl"
          >
            {m.title} {bw ? "" : "colored "}manga — FAQ
          </h2>
          <div className="mt-4 max-w-3xl divide-y divide-line/40 rounded-2xl bg-panel/40">
            {faqs.map((f) => (
              <details key={f.q} className="group px-5 py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold sm:text-base">
                  {f.q}
                  <span className="text-mute transition group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-mute">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
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
        <div className="mb-4 flex items-center justify-between gap-3">
          <nav className="text-xs text-mute" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-brand">Home</Link>
            <span className="px-1.5">/</span>
            <span className="text-fg">{m.title}</span>
          </nav>
          <ShareButton title={`${m.title} in color — Colorized Manga`} />
        </div>

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
                prefetch={false}
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
