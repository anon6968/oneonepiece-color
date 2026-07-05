import Link from "next/link";
import type { Metadata } from "next";
import { MANGAS, comingSoonMangas, liveMangas } from "@/lib/manga";
import { SITE, mangaPath, readPath } from "@/lib/site";
import { stats } from "@/lib/data";
import MangaCard from "@/components/MangaCard";
import AnimatedLogo from "@/components/AnimatedLogo";
import ContinueReading from "@/components/ContinueReading";

export const metadata: Metadata = {
  title: "Colorized Manga — Read Manga in Full Color Online Free",
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  const live = liveMangas();
  const soon = comingSoonMangas();
  const featured = live[0];
  const totalPages = live.reduce((sum, m) => sum + stats(m.slug).totalPages, 0);

  const faqs = [
    {
      q: "What is colorized manga?",
      a: `Colorized manga is the original black-and-white manga with every page digitally colored in full HD. ${SITE.name} publishes color editions of hit series like ${live
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
      a: `${live.length} series are live in full color right now — including ${live
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
          name: `${m.title} (Colored Edition)`,
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
            className="mx-auto mb-8 w-36 [mask-image:radial-gradient(ellipse_at_center,black_68%,transparent_98%)] sm:mx-0 md:hidden"
          />

          <p className="inline-flex items-center gap-2 rounded-full bg-panel px-3.5 py-1.5 text-xs font-medium text-mute sm:text-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulseGlow" aria-hidden />
            {totalPages.toLocaleString("en-US")} pages colorized · {live.length} series live ·{" "}
            {soon.length} more in the library
          </p>

          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl">
            Read manga in{" "}
            <span className="bg-gradient-to-r from-brand via-brand-2 to-gold bg-clip-text text-transparent">
              full color
            </span>
            , online &amp; free.
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-mute sm:text-lg">
            Every page digitally colored in HD. No signup, no paywall — just pick a
            series and start reading.
          </p>

          {featured && (
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href={readPath(featured, 1)}
                className="rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand/25 transition hover:brightness-110"
              >
                Read {featured.title} in color →
              </Link>
              <ContinueReading
                series={live.map((m) => ({ slug: m.slug, title: m.title, unit: m.unit }))}
              />
            </div>
          )}
        </div>

        <div className="hidden animate-fadeUp md:flex md:justify-center">
          <AnimatedLogo
            motion="rock"
            priority
            className="w-full max-w-[420px] [mask-image:radial-gradient(ellipse_at_center,black_68%,transparent_98%)]"
          />
        </div>
      </section>

      {/* Library — the cards ARE the navigation. Only series we actually have. */}
      <section id="library" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-14 pt-6 2xl:max-w-7xl">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          The colorized manga library
        </h2>
        <p className="mt-1.5 mb-7 text-sm text-mute sm:text-base">
          Every series we&apos;re coloring — live titles are fully readable now, the rest
          are on the way.
        </p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {live.map((m, i) => (
            <MangaCard key={m.slug} manga={m} priority={i < 3} />
          ))}
        </div>

        {soon.length > 0 && (
          <div className="mt-14">
            <h3 className="text-xl font-bold tracking-tight sm:text-2xl">More in the library</h3>
            <p className="mt-1.5 mb-6 text-sm text-mute sm:text-base">
              Being colorized now — each card shows how much color is ready so far.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {soon.map((m) => (
                <MangaCard key={m.slug} manga={m} />
              ))}
            </div>
          </div>
        )}
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
                <Link href={mangaPath(m.slug)} className="text-brand/80 hover:underline">
                  colorized {m.title}
                </Link>
              </span>
            ))}{" "}
            {live.length === 1 ? "is" : "are"} live now, each with a fast, mobile-friendly reader
            and pinch-to-zoom on every page. No signup, just the color manga.
          </p>
        </div>
      </section>
    </>
  );
}
