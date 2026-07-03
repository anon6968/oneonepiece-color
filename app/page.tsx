import Link from "next/link";
import type { Metadata } from "next";
import { MANGAS, liveMangas, comingSoonMangas } from "@/lib/manga";
import { stats } from "@/lib/data";
import { SITE, mangaPath, readPath, unitLabelPlural } from "@/lib/site";
import MangaCard from "@/components/MangaCard";
import AnimatedLogo from "@/components/AnimatedLogo";

export const metadata: Metadata = {
  title: "Colorized Manga — Read Manga in Full Color Online Free",
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  const live = liveMangas();
  const soon = comingSoonMangas();
  const featured = live[0];
  const fStats = featured ? stats(featured.slug) : null;
  const totalColored = live.reduce((sum, m) => sum + stats(m.slug).colored, 0);
  const totalPages = live.reduce((sum, m) => sum + stats(m.slug).totalPages, 0);

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
          target: `${SITE.url}/one-piece/chapters?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE.url}/#collection`,
        url: SITE.url,
        name: "Colorized Manga library",
        description: SITE.description,
        hasPart: MANGAS.map((m) => ({
          "@type": "ComicSeries",
          name: `${m.title} (Colored Edition)`,
          url: `${SITE.url}${mangaPath(m.slug)}`,
          author: { "@type": "Person", name: m.author },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl 2xl:max-w-7xl items-center gap-8 px-4 py-16 sm:py-24 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
          <div className="animate-fadeUp">
            <span className="inline-flex items-center gap-2 rounded-full bg-panel/70 px-3 py-1 text-xs text-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulseGlow" />
              {totalPages.toLocaleString()} pages colorized · {live.length} series live ·{" "}
              {soon.length} more coming
            </span>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
              Read manga in{" "}
              <span className="bg-gradient-to-r from-brand via-brand-2 to-gold bg-clip-text text-transparent">
                full color
              </span>
              , online &amp; free.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
              {SITE.name}{" "}
              is the home of the colorized manga — legendary series digitally colored in HD, from
              black &amp; white into vivid full color. No signup, built to read fast on phone and
              laptop with pinch-to-zoom on every page.
            </p>
            {featured && fStats && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  href={readPath(featured, 1)}
                  className="rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:brightness-110"
                >
                  Read {featured.title} in color →
                </Link>
                <Link
                  href="#library"
                  className="rounded-xl bg-panel px-5 py-3 text-sm font-semibold text-fg transition hover:bg-panel-2"
                >
                  Browse all manga
                </Link>
              </div>
            )}
          </div>

          <div className="relative hidden animate-fadeUp lg:flex lg:justify-center">
            <div className="pointer-events-none absolute inset-6 -z-10 rounded-full bg-brand/20 blur-3xl" />
            <AnimatedLogo motion="rock" priority className="w-full max-w-[480px]" />
          </div>
        </div>
      </section>

      {/* Library — the "preview of all monitors" */}
      <section id="library" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-10 2xl:max-w-7xl">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">The colorized manga library</h2>
            <p className="mt-1 text-sm text-mute">
              Every series we&apos;re coloring. Live titles are fully readable now; the rest are in
              progress.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-5">
          {MANGAS.map((m, i) => (
            <MangaCard key={m.slug} manga={m} priority={i < 6} />
          ))}
        </div>
      </section>

      {/* Available now spotlight */}
      {live.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-8 2xl:max-w-7xl">
          <h2 className="mb-5 text-xl font-bold sm:text-2xl">Available now in full color</h2>
          <div className="space-y-4">
            {live.map((m) => {
              const s = stats(m.slug);
              return (
                <Link
                  key={m.slug}
                  href={mangaPath(m.slug)}
                  className="flex items-center gap-4 rounded-2xl bg-panel p-4 transition hover:bg-panel-2"
                >
                  <span className="grid h-12 w-12 flex-none place-items-center rounded-xl bg-gradient-to-br from-blood to-brand text-2xl">
                    {m.mark}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-bold">Colorized {m.title} manga</div>
                    <p className="mt-0.5 line-clamp-1 text-sm text-mute">{m.tagline}</p>
                  </div>
                  <div className="flex-none text-right">
                    <div className="text-sm font-bold text-brand">{s.colored}</div>
                    <div className="text-[11px] text-mute">{unitLabelPlural(m)} in color</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* About / SEO copy */}
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="space-y-4 text-sm leading-relaxed text-mute">
          <h2 className="text-lg font-bold text-fg">About Colorized Manga</h2>
          <p>
            <strong className="text-fg">{SITE.name}</strong> is where you read the{" "}
            <strong className="text-fg">colorized manga</strong> versions of the world&apos;s
            biggest series online for free. Every page is digitally colored in high definition — the
            same iconic stories, now brought to life in vivid full color instead of black and white.
          </p>
          <p>
            {live.map((m, i) => (
              <span key={m.slug}>
                {i > 0 && (i === live.length - 1 ? " and " : ", ")}
                <Link href={mangaPath(m.slug)} className="text-brand hover:underline">
                  colorized {m.title}
                </Link>
              </span>
            ))}{" "}
            {live.length === 1 ? "is" : "are"} live now, with{" "}
            {comingSoonMangas()
              .map((m) => m.title)
              .join(", ")}{" "}
            being colored next. Each series has its own fast, mobile-friendly reader with
            pinch-to-zoom on every page — no signup, no apps, just the color manga.
          </p>
        </div>
      </section>
    </>
  );
}
