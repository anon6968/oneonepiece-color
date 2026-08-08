import Link from "@/components/StaticLink";
import Image from "next/image";
import type { Metadata } from "next";
import { MANGAS, comingSoonMangas, topLevelLiveMangas } from "@/lib/manga";
import { SITE, mangaPath, readPath } from "@/lib/site";
import { stats } from "@/lib/data";
import MangaCard from "@/components/MangaCard";
import ContinueReading from "@/components/ContinueReading";
import SeriesSearch from "@/components/SeriesSearch";

export const metadata: Metadata = {
  // `absolute` bypasses the layout's "%s | Colorized Manga" template so the
  // home <title> isn't doubled up into "… Free | Colorized Manga".
  title: { absolute: "Colorized Manga — Read Manga in Full Color Online Free" },
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  const live = topLevelLiveMangas();
  const soon = comingSoonMangas();
  // Split live titles: genuinely colorized editions vs. black & white editions
  // (the full manga in B&W, hosted free — official color not out yet).
  // Homepage card order — curated most-popular-first, per grid. Edit this list to
  // reorder the library. Color slugs first, then black-&-white slugs; each grid
  // sorts its own subset by list position. Unlisted series fall back to the
  // `popularity` field, then title. (Dragon Ball is demoted off the front row —
  // weak cover art — so Bleach/Demon Slayer lead instead.)
  const FAME_ORDER = [
    // ── color, most-famous first ──
    "one-piece", "naruto", "bleach", "demon-slayer", "chainsaw-man",
    "jujutsu-kaisen", "attack-on-titan", "death-note", "hunter-x-hunter",
    "dragon-ball", "one-punch-man", "solo-leveling", "jojos-bizarre-adventure",
    "yu-gi-oh", "kaguya-sama", "rurouni-kenshin", "golden-kamuy", "akira",
    "my-hero-academia", "fire-force", "hoshin-engi", "lookism", "shadows-house",
    // ── black & white, most-popular first ──
    "berserk", "vinland-saga", "vagabond", "fullmetal-alchemist", "tokyo-ghoul",
    "slam-dunk", "monster", "detective-conan", "fairy-tail", "kingdom", "haikyu",
    "dr-stone", "the-promised-neverland", "tokyo-revengers", "blue-lock",
    "dandadan", "sakamoto-days", "frieren", "kaiju-no-8", "oshi-no-ko",
    "mob-psycho-100", "gintama", "fist-of-the-north-star", "seven-deadly-sins",
    "black-clover", "assassination-classroom", "yu-yu-hakusho", "20th-century-boys",
    "sailor-moon", "inuyasha", "doraemon", "hells-paradise", "food-wars",
    "blue-exorcist", "soul-eater", "black-butler", "noragami", "world-trigger",
    "mashle", "goblin-slayer", "komi-cant-communicate", "goodnight-punpun",
    "kagurabachi", "spy-x-family",
  ];
  const rankOf = (slug: string) => {
    const i = FAME_ORDER.indexOf(slug);
    return i < 0 ? 9999 : i;
  };
  const byFame = (a: (typeof live)[number], b: (typeof live)[number]) =>
    rankOf(a.slug) - rankOf(b.slug) ||
    (a.popularity ?? 9999) - (b.popularity ?? 9999) ||
    a.title.localeCompare(b.title);
  const liveColor = live.filter((m) => m.color !== "none").sort(byFame);
  const liveBW = live.filter((m) => m.color === "none").sort(byFame);
  const featured = liveColor[0] ?? live[0];
  const totalPages = liveColor.reduce((sum, m) => sum + stats(m.slug).coloredPages, 0);
  const fullColor = liveColor.filter((m) => m.color === "full");
  const partialColor = liveColor.filter((m) => m.color === "partial");

  const faqs = [
    {
      q: "What is colorized manga?",
      a: `Colorized manga is the original black-and-white manga with every page digitally colored in full HD. ${SITE.name} publishes color editions of hit series like ${liveColor
        .slice(0, 3)
        .map((m) => m.title)
        .join(", ")} so you can read them the way the anime looks — in full color.`,
    },
    {
      q: "Is it free to read colorized manga here?",
      a: "Yes. Every colorized chapter is free to read online — no signup, no account and no paywall. Just open a series and start reading.",
    },
    {
      q: "Do I need to download an app or create an account?",
      a: "No. It runs entirely in your browser on phone, tablet or desktop, with a fast reader and pinch-to-zoom on every page. Nothing to install and no login required.",
    },
    {
      q: "Which manga are available in color?",
      a: `${liveColor.length} series have color chapters available right now — including ${liveColor
        .slice(0, 5)
        .map((m) => m.title)
        .join(", ")}. ${fullColor.length} are fully colored and ${partialColor.length} have mixed color and black & white coverage, with ${soon.length} more being prepared.`,
    },
    {
      q: "How often are new colorized chapters added?",
      a: "New colored chapters are published as soon as they are finished. Check any series' Latest page for the most recent color releases first.",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE.url}/#collection`,
        url: SITE.url,
        name: "Colorized Manga library",
        description: SITE.description,
        isPartOf: { "@id": `${SITE.url}/#website` },
        hasPart: MANGAS.map((m) => ({
          "@type": "ComicSeries",
          name: m.color === "none" ? m.title : `${m.title} (Colored Edition)`,
          url: `${SITE.url}${mangaPath(m.slug)}`,
          author: { "@type": "Person", name: m.author },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE.url}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero — the copy stays aligned to the site's content grid while the
          crossover artwork runs full bleed to the viewport's right edge. */}
      <section className="grid w-full items-center overflow-hidden py-14 sm:py-16 md:py-20 xl:grid-cols-[max(1rem,calc((100vw-70rem)/2))_minmax(0,32.5rem)_minmax(0,1fr)] 2xl:grid-cols-[max(1rem,calc((100vw-78rem)/2))_minmax(0,36rem)_minmax(0,1fr)]">
        <div className="relative animate-fadeUp px-4 xl:col-start-2 xl:row-start-1 xl:px-0 xl:pr-8 2xl:pr-10">
          {/* Warm red glow stays behind the copy, where it adds separation
              without tinting or obscuring the artwork. */}
          {/* Kept within the column's horizontal bounds (inset-x-0, not a
              negative inset) so the box never extends past the viewport — the
              blur alone gives the soft halo without adding scroll width, which
              is what let a downward swipe drift the page sideways. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -inset-y-12 -z-10 rounded-full bg-brand/[.07] blur-3xl"
          />

          <p className="inline-flex items-center gap-2 rounded-full bg-panel px-3.5 py-1.5 text-xs font-medium text-mute sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulseGlow" aria-hidden />
            {totalPages.toLocaleString("en-US")} pages colorized · {live.length} series live ·{" "}
            {soon.length} more in the library
          </p>

          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Read{" "}
            <span className="bg-gradient-to-r from-brand-2 via-brand to-brand bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(224,17,35,0.35)]">
              colorized manga
            </span>{" "}
            in full color, free.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            Full-color and partially colored editions, with every black &amp; white unit clearly
            labeled. No signup or paywall — just pick a series and start reading.
          </p>

          {featured && (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={readPath(featured, 1)}
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-brand to-brand-2 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand/40 ring-1 ring-brand-2/50 transition hover:brightness-110 hover:shadow-brand/60"
              >
                Read {featured.title} in color →
              </Link>
              <ContinueReading
                series={live.map((m) => ({ slug: m.slug, title: m.title, unit: m.unit }))}
              />
            </div>
          )}
        </div>

        <div className="relative mt-10 aspect-[4/3] w-full animate-fadeUp overflow-hidden sm:aspect-[16/9] md:aspect-[2/1] xl:col-start-3 xl:row-start-1 xl:mt-0 xl:h-[clamp(34rem,42vw,42rem)] xl:aspect-auto">
          <Image
            src="/hero-legends-assemble.webp"
            alt="Colorized Manga heroes assembled in full color"
            fill
            priority
            sizes="(min-width: 1536px) 55vw, (min-width: 1280px) 53vw, 100vw"
            className="object-cover object-[72%_center] [mask-image:linear-gradient(to_bottom,transparent_0%,black_5%,black_93%,transparent_100%)] xl:[mask-image:linear-gradient(to_right,transparent_0%,black_12%,black_100%)]"
          />
        </div>
      </section>

      {/* Library — the cards ARE the navigation. Only series we actually have. */}
      <section id="library" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14 pt-6 2xl:max-w-7xl">
        {/* Color / B&W view switch — the driving radios live at <body> scope
            (app/layout.tsx) so the mobile bottom-nav can toggle the same state;
            the labels below (and in MobileNav) reference them by id. Pure CSS
            (:has, see globals.css) — no JS, works before hydration, and BOTH
            grids stay in the server-rendered DOM, so the colorized-manga SEO is
            never gated behind a click — this is purely a visual filter. */}

        <div className="text-center">
          {/* Heading swaps with the toggle. BOTH variants ship in the server-
              rendered DOM, so the "colorized manga library" heading is always
              crawlable; color is the default-visible one, keeping the primary
              keyword front-and-center for SEO. */}
          <div className="lib-head-color">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              The colorized manga library
            </h2>
            <p className="mx-auto mt-1.5 max-w-2xl text-sm text-mute sm:text-base">
              Every series with color pages available — complete color editions and mixed
              catalogs are clearly labeled.
            </p>
          </div>
          <div className="lib-head-bw">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              The black &amp; white manga library
            </h2>
            <p className="mx-auto mt-1.5 max-w-2xl text-sm text-mute sm:text-base">
              The full manga, free in high-quality black &amp; white — every chapter clearly
              labeled, and each flips to color the moment an official colored release exists.
            </p>
          </div>

          {/* Color / Black & white segmented toggle — centered, directly below
              the title so the switch is obvious. */}
          <div
            className="lib-toggle mt-5 inline-flex items-center gap-1 rounded-lg border border-line bg-panel/60 p-1"
            role="tablist"
            aria-label="Filter library by color or black and white"
          >
            <label htmlFor="lib-view-color" data-tab="color">
              Color
            </label>
            <label htmlFor="lib-view-bw" data-tab="bw">
              Black &amp; white
            </label>
          </div>

          {/* One search across BOTH libraries — the toggle filters the grid,
              this finds any series regardless of which side it lives on. */}
          <div className="mt-5">
            <SeriesSearch
              items={live.map((m) => ({
                slug: m.slug,
                title: m.title,
                alt: m.altTitles ?? [],
                color: m.color,
                chapters: stats(m.slug).total,
              }))}
            />
          </div>
        </div>

        {/* Color library (default view) */}
        <div className="lib-color-view mt-7">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {liveColor.map((m, i) => (
              <MangaCard key={m.slug} manga={m} priority={i < 3} />
            ))}
          </div>
        </div>

        {/* Black & white library (revealed by the toggle) */}
        <div className="lib-bw-view mt-7">
          {liveBW.length > 0 && (
            <div id="black-and-white" className="scroll-mt-20">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                Black &amp; white editions — the full manga, free
              </h3>
              <p className="mt-1.5 mb-6 text-sm text-mute sm:text-base">
                The biggest series that don&apos;t have an official color edition yet — hosted
                complete in high-quality black &amp; white so you can read the whole story right
                now, free. Every chapter is clearly labeled B&amp;W, and each one flips to color
                the moment an official colored release exists.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {liveBW.map((m) => (
                  <MangaCard key={m.slug} manga={m} />
                ))}
              </div>
            </div>
          )}

          {soon.length > 0 && (
            <div className="mt-14">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
                Black &amp; white now — full color coming soon
              </h3>
              <p className="mt-1.5 mb-6 text-sm text-mute sm:text-base">
                These run in black &amp; white today. We&apos;re working on the full-color
                editions — they&apos;ll move up into the library above as color is ready.
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {soon.map((m) => (
                  <MangaCard key={m.slug} manga={m} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FAQ — real on-page answers backing the FAQPage structured data. */}
      <section className="mx-auto max-w-3xl px-4 pb-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
          Frequently asked questions
        </h2>
        <div className="divide-y divide-line/40 rounded-2xl bg-panel/40">
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

      {/* Contact CTA — closing call-to-action + an internal link to /contact. */}
      <section className="mx-auto max-w-3xl px-4 pb-14">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-line bg-panel/40 px-6 py-10 text-center sm:px-10">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Still have a question?
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-mute sm:text-base">
            Spotted a broken chapter, want a series colorized, or just want to say hi?
            We read every message and reply as soon as we can.
          </p>
          <Link
            href="/contact"
            className="mt-1 inline-flex items-center rounded-xl bg-gradient-to-r from-brand to-brand-2 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand/40 ring-1 ring-brand-2/50 transition hover:brightness-110 hover:shadow-brand/60"
          >
            Contact us →
          </Link>
        </div>
      </section>

      {/* About / SEO copy — condensed and kept at the very bottom for search engines. */}
      <section className="mx-auto max-w-3xl px-4 pb-16">
        <div className="space-y-2 text-xs leading-relaxed text-mute/80">
          <h2 className="text-sm font-semibold text-mute">About Colorized Manga</h2>
          <p>
            <strong className="text-mute">{SITE.name}</strong> is where you read the{" "}
            <strong className="text-mute">colorized manga</strong>{" "}
            versions of the world&apos;s biggest series online for free. Color coverage is
            recorded per chapter, and black &amp; white units are clearly labeled.{" "}
            {liveColor.map((m, i) => (
              <span key={m.slug}>
                {i > 0 && (i === liveColor.length - 1 ? " and " : ", ")}
                <Link href={mangaPath(m.slug)} prefetch={false} className="text-brand/80 hover:underline">
                  colorized {m.title}
                </Link>
              </span>
            ))}{" "}
            {liveColor.length === 1 ? "has" : "have"} color pages live now, each with a fast,
            mobile-friendly reader and pinch-to-zoom. No signup required.
          </p>
          <p>
            However you spell it — <strong className="text-mute">colourised manga</strong>,{" "}
            <strong className="text-mute">coloured manga</strong> or colour manga — it&apos;s the
            same thing: the original black-and-white pages digitally recolored in full HD, free to
            read online. Prefer British English? Read{" "}
            <a
              href="https://colourisedmanga.com"
              className="text-brand/80 hover:underline"
            >
              colourised manga
            </a>{" "}
            over on our sister site.
          </p>
        </div>
      </section>
    </>
  );
}
