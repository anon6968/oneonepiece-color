import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms of use for Colorized Manga, an independent, non-commercial fan project. Provided as-is, with no affiliation to any rights holder.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Terms of use</h1>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-mute sm:text-base">
        <p>
          By using {SITE.name} (the &ldquo;site&rdquo;) you agree to these terms. If you
          do not agree, please do not use the site.
        </p>

        <h2 className="pt-4 text-lg font-bold text-fg">What this site is</h2>
        <p>
          {SITE.name} is an independent, non-commercial fan project. It presents
          fan-made color edits of existing works. It is not affiliated with,
          authorized, endorsed, or sponsored by any creator, publisher, distributor, or
          rights holder, and it does not sell subscriptions, products, or advertising.
          All original works, characters, and related trademarks are the property of
          their respective owners.
        </p>

        <h2 className="pt-4 text-lg font-bold text-fg">Third-party content</h2>
        <p>
          Color edits are created by third parties in the fan community, and images may
          be served from third-party sources. We do not claim ownership of the
          underlying works. If you are a rights holder, you can{" "}
          <Link href="/dmca" className="text-brand underline">
            request removal here
          </Link>
          , and we will review and act on valid requests promptly.
        </p>

        <h2 className="pt-4 text-lg font-bold text-fg">Provided &ldquo;as is&rdquo;</h2>
        <p>
          The site is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
          basis, without warranties of any kind. To the fullest extent permitted by
          law, we disclaim all warranties and are not liable for any damages arising
          from your use of the site.
        </p>

        <h2 className="pt-4 text-lg font-bold text-fg">Acceptable use</h2>
        <p>
          Do not use the site for unlawful purposes, and do not attempt to disrupt,
          scrape at scale, or misuse it. We may modify or discontinue the site, or these
          terms, at any time.
        </p>

        <h2 className="pt-4 text-lg font-bold text-fg">Contact</h2>
        <p>
          Questions or requests:{" "}
          <a href={`mailto:${SITE.contact}`} className="text-brand underline">
            {SITE.contact}
          </a>
          .
        </p>

        <p className="pt-2 text-mute/70">
          These terms are provided for general information and are not legal advice.
        </p>
      </div>
    </section>
  );
}
