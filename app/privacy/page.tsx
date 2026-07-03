import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Colorized Manga. No accounts, no sign-ups, and only privacy-friendly aggregate analytics.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Privacy policy</h1>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-mute sm:text-base">
        <p>
          {SITE.name} is built to be private by default. We do not offer accounts, we do
          not ask you to sign up, and we do not collect names, email addresses, or other
          personal details to browse the site.
        </p>

        <h2 className="pt-4 text-lg font-bold text-fg">Analytics</h2>
        <p>
          We use privacy-friendly, aggregate analytics (Vercel Analytics) to understand
          overall traffic — such as page views and general device or country
          information — in a form that is not used to identify individual visitors. This
          helps us keep the reader fast and working across devices.
        </p>

        <h2 className="pt-4 text-lg font-bold text-fg">Images and third parties</h2>
        <p>
          Page images may be served from third-party content delivery networks. When
          your browser loads those images, the third-party provider may receive standard
          technical request information (such as your IP address and browser type) as
          part of delivering the files, subject to that provider&rsquo;s own policies.
        </p>

        <h2 className="pt-4 text-lg font-bold text-fg">Cookies</h2>
        <p>
          We do not use tracking or advertising cookies. Any local storage is limited to
          remembering basic reading preferences on your own device.
        </p>

        <h2 className="pt-4 text-lg font-bold text-fg">Contact</h2>
        <p>
          Questions about this policy, or a{" "}
          <Link href="/dmca" className="text-brand underline">
            content-removal request
          </Link>
          :{" "}
          <a href={`mailto:${SITE.contact}`} className="text-brand underline">
            {SITE.contact}
          </a>
          .
        </p>

        <p className="pt-2 text-mute/70">
          This policy is provided for general information and is not legal advice.
        </p>
      </div>
    </section>
  );
}
