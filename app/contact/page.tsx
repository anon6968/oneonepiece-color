import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Colorized Manga — questions, feedback, corrections, a broken chapter, business inquiries or content-removal requests. We read every message.",
  alternates: { canonical: "/contact" },
};

const reasons = [
  {
    title: "Questions & feedback",
    body: "Anything about the site, a series, or how the reader works — we’re happy to help.",
  },
  {
    title: "Report a problem",
    body: "A chapter that won’t load, a wrong page order, a typo or a mislabeled title — tell us the series and page and we’ll fix it.",
  },
  {
    title: "Business & partnerships",
    body: "Collaborations, colorists who want to contribute, or anything commercial.",
  },
];

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE.url}/contact#contact`,
    name: "Contact Colorized Manga",
    url: `${SITE.url}/contact`,
    description:
      "Get in touch with Colorized Manga for questions, feedback, corrections, business inquiries or content-removal requests.",
    isPartOf: { "@id": `${SITE.url}/#website` },
    mainEntity: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
      email: SITE.email,
      contactPoint: {
        "@type": "ContactPoint",
        email: SITE.email,
        contactType: "customer support",
        availableLanguage: "English",
      },
    },
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Contact us</h1>

      <p className="mt-5 max-w-2xl text-base leading-relaxed text-mute sm:text-lg">
        Got a question, spotted something broken, or want to reach the team behind{" "}
        {SITE.name}? Email us — we read every message and reply as soon as we can.
      </p>

      {/* Primary contact — the email as an obvious, tappable card. */}
      <div className="mt-8 rounded-2xl border border-line bg-panel/50 p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-mute">
          Email
        </p>
        <a
          href={`mailto:${SITE.email}`}
          className="mt-2 inline-flex items-center gap-2 text-xl font-bold text-brand-2 underline decoration-brand/40 underline-offset-4 transition hover:decoration-brand sm:text-2xl"
        >
          {SITE.email}
        </a>
        <div className="mt-5">
          <a
            href={`mailto:${SITE.email}?subject=${encodeURIComponent(
              "Colorized Manga — enquiry",
            )}`}
            className="inline-flex items-center rounded-xl bg-gradient-to-r from-brand to-brand-2 px-6 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand/40 ring-1 ring-brand-2/50 transition hover:brightness-110 hover:shadow-brand/60"
          >
            Send us an email →
          </a>
        </div>
      </div>

      {/* What people write in about. */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {reasons.map((r) => (
          <div key={r.title} className="rounded-xl border border-line/70 bg-panel/30 p-5">
            <h2 className="text-sm font-bold text-fg">{r.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-mute">{r.body}</p>
          </div>
        ))}
      </div>

      {/* Rights-holder pointer — keeps takedowns on the dedicated flow. */}
      <div className="mt-10 space-y-3 text-sm leading-relaxed text-mute sm:text-base">
        <h2 className="text-lg font-bold text-fg">Rights holders</h2>
        <p>
          {SITE.name} is an independent, non-commercial fan project and is not
          affiliated with any creator, publisher or rights holder. If you own the
          rights to a work and want material removed, you can email us above or use
          the{" "}
          <Link href="/dmca" className="text-brand underline">
            content removal / DMCA
          </Link>{" "}
          process, and we’ll act on valid requests promptly.
        </p>
      </div>
    </section>
  );
}
