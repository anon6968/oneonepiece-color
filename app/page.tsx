import Link from "next/link";
import type { Metadata } from "next";
import { getIndex, groupBySaga, stats } from "@/lib/data";
import { SITE } from "@/lib/site";
import ChapterCard from "@/components/ChapterCard";

export const metadata: Metadata = {
  title: "One Piece Color Manga — Read One Piece in Full Color Online Free",
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  const index = getIndex();
  const s = stats();
  const sagas = groupBySaga();
  const latest = [...index].reverse().slice(0, 12);
  const first = index.slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: SITE.description,
        inLanguage: "en",
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE.url}/chapters?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "ComicSeries",
        name: "One Piece (Colored / Digital Color Edition)",
        alternateName: ["One Piece Color Manga", "Colorized One Piece"],
        url: SITE.url,
        genre: ["Action", "Adventure", "Fantasy", "Comedy"],
        author: { "@type": "Person", name: "Eiichiro Oda" },
        publisher: { "@type": "Organization", name: "Shueisha" },
        numberOfEpisodes: s.total,
        inLanguage: "en",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <div className="animate-fadeUp">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs text-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              {s.colored} chapters in full color · updated to Ch. {s.last}
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              Read <span className="text-brand">One Piece</span> in{" "}
              <span className="bg-gradient-to-r from-brand via-brand-2 to-gold bg-clip-text text-transparent">
                full color
              </span>
              , online &amp; free.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
              The complete colorized One Piece manga — every page digitally colored in HD, from
              Romance Dawn to the latest arc. No signup, built to read fast on phone and laptop
              with pinch-to-zoom on every page.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/read/1"
                className="rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:brightness-110"
              >
                Start from Chapter 1 →
              </Link>
              {s.last > 0 && (
                <Link
                  href={`/read/${s.last}`}
                  className="rounded-xl border border-line bg-panel px-5 py-3 text-sm font-semibold text-fg transition hover:border-brand/50"
                >
                  Latest · Chapter {s.last}
                </Link>
              )}
              <Link
                href="/chapters"
                className="rounded-xl px-5 py-3 text-sm font-semibold text-mute transition hover:text-fg"
              >
                Browse all chapters
              </Link>
            </div>
          </div>
        </div>
      </section>

      {latest.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold sm:text-2xl">Latest color chapters</h2>
            <Link href="/chapters" className="text-sm text-brand hover:underline">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {latest.map((c, i) => (
              <ChapterCard key={c.chapter} c={c} priority={i < 6} />
            ))}
          </div>
        </section>
      )}

      {first.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-4">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-xl font-bold sm:text-2xl">Start from the beginning · East Blue</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
            {first.map((c) => (
              <ChapterCard key={c.chapter} c={c} />
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
                  href={`/chapters#${slug(sg.saga)}`}
                  className="rounded-xl border border-line bg-panel p-4 transition hover:border-brand/50 hover:bg-panel-2"
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
          <h2 className="text-lg font-bold text-fg">About the One Piece colored manga</h2>
          <p>
            <strong className="text-fg">One Piece Color</strong> is the place to read the{" "}
            <strong className="text-fg">colorized One Piece manga</strong> online for free. Every
            chapter of Eiichiro Oda&apos;s legendary series has been digitally colored in high
            definition — the same iconic story of Monkey D. Luffy and the Straw Hat Pirates, now
            brought to life in vivid full color instead of black and white.
          </p>
          <p>
            We currently host {s.colored} fully colored chapters spanning{" "}
            {sagas.map((x) => x.saga).slice(0, 6).join(", ")} and beyond, up to chapter {s.last}.
            The reader is optimized for both mobile and desktop: pages load fast from a global CDN,
            keep their aspect ratio to avoid layout jumps, and every page supports zoom and pan so
            you never miss a detail of the colored artwork.
          </p>
          <p>
            Whether you&apos;re starting the adventure from{" "}
            <Link href="/read/1" className="text-brand hover:underline">
              Chapter 1: Romance Dawn
            </Link>{" "}
            or catching up on the latest arc, this is the fastest way to read One Piece in color.
          </p>
        </div>
      </section>
    </>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
