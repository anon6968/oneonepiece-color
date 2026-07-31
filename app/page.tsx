import Link from "next/link";
import type { Metadata } from "next";
import { MANGAS, comingSoonMangas, topLevelLiveMangas } from "@/lib/manga";
import { SITE, mangaPath, readPath } from "@/lib/site";
import { stats } from "@/lib/data";
import MangaCard from "@/components/MangaCard";
import AnimatedLogo from "@/components/AnimatedLogo";
import ContinueReading from "@/components/ContinueReading";

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
  const liveColor = live.filter((m) => m.color !== "none");
  const liveBW = live.filter((m) => m.color === "none");
  const featured = liveColor[0] ?? live[0];
  const totalPages = liveColor.reduce((sum, m) => sum + stats(m.slug).totalPages, 0);

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
      a: `${liveColor.length} series are live in full color right now — including ${liveColor
        .slice(0, 5)
        .map((m) => m.title)
        .join(", ")} — with ${soon.length} more being colorized. New color chapters are added as they are finished.`,
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

      {/* Hero — two columns: headline + SEO copy + CTAs on the left, the
          animated ship logo at resting size on the right. */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:py-16 md:grid-cols-[1.05fr_.85fr] md:py-20 2xl:max-w-7xl">
        <div className="relative animate-fadeUp">
          {/* Warm red glow sits behind the text, not the logo — behind the
              logo it haloed the art's square tile and looked cheap. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-20 -inset-y-12 -z-10 rounded-full bg-brand/[.07] blur-3xl"
          />
          {/* The logo still leads on small screens, where the right column is hidden. */}
          <AnimatedLogo
            motion="rock"
            priority
            className="mx-auto mb-8 w-36 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_86%)] sm:mx-0 md:hidden"
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
            Every page digitally colored in HD. No signup, no paywall — just pick a
            series and start reading.
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

        <div className="relative hidden animate-fadeUp md:flex md:justify-center">
          <AnimatedLogo
            motion="rock"
            priority
            className="w-full max-w-[420px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_86%)]"
          />
        </div>
      </section>

      {/* Library — the cards ARE the navigation. Only series we actually have. */}
      <section id="library" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14 pt-6 2xl:max-w-7xl">
        {/* Color / B&W view switch — uncontrolled radios so the toggle is pure
            CSS (:has, see globals.css). No JS, works before hydration, and BOTH
            grids stay in the server-rendered DOM, so the colorized-manga SEO is
            never gated behind a click — this is purely a visual filter. */}
        <input type="radio" name="lib-view" id="lib-view-color" className="sr-only" defaultChecked />
        <input type="radio" name="lib-view" id="lib-view-bw" className="sr-only" />

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
              Every series we&apos;re coloring — live titles are fully readable now, the rest
              are on the way.
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
            versions of the world&apos;s
            biggest series online for free — every page digitally colored in HD.{" "}
            {live.map((m, i) => (
              <span key={m.slug}>
                {i > 0 && (i === live.length - 1 ? " and " : ", ")}
                <Link href={mangaPath(m.slug)} prefetch={false} className="text-brand/80 hover:underline">
                  colorized {m.title}
                </Link>
              </span>
            ))}{" "}
            {live.length === 1 ? "is" : "are"} live now, each with a fast, mobile-friendly reader
            and pinch-to-zoom on every page. No signup, just the color manga.
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
