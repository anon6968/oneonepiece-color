import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Content Removal & DMCA",
  description:
    "How rights holders can request removal of content from Colorized Manga. Colorized Manga is an independent fan project and honors valid removal requests.",
  alternates: { canonical: "/dmca" },
};

export default function DmcaPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
        Content removal &amp; DMCA
      </h1>

      <div className="mt-6 space-y-5 text-sm leading-relaxed text-mute sm:text-base">
        <p>
          {SITE.name} is an independent, non-commercial fan project. It hosts
          fan-made color edits of existing works and is not affiliated with,
          authorized, endorsed, or sponsored by any creator, publisher, or rights
          holder. All original works remain the property of their respective owners.
        </p>

        <p>
          We respect the rights of copyright owners and respond to valid removal
          requests. If you are a rights holder (or authorized to act on their behalf)
          and believe material on this site should be taken down, please contact us
          and we will review and act on legitimate requests promptly.
        </p>

        <h2 className="pt-4 text-lg font-bold text-fg">How to request removal</h2>
        <p>
          Email{" "}
          <a href={`mailto:${SITE.contact}`} className="text-brand underline">
            {SITE.contact}
          </a>{" "}
          with the following, so we can act quickly:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Identification of the work or material you say is infringing.</li>
          <li>
            The specific page URL(s) on {SITE.url.replace(/^https?:\/\//, "")} where
            the material appears.
          </li>
          <li>
            Your name, and your relationship to the work or the authority under which
            you make the request.
          </li>
          <li>Contact details we can reach you at.</li>
          <li>
            A statement that you have a good-faith belief the use is not authorized by
            the rights holder, its agent, or the law.
          </li>
        </ul>

        <h2 className="pt-4 text-lg font-bold text-fg">What happens next</h2>
        <p>
          We review each request and, where it is valid, remove or disable access to
          the identified material. Because content is served from third-party sources,
          removal here disables the material as presented on this site.
        </p>

        <p className="pt-2 text-mute/70">
          This page describes our voluntary removal process and is not legal advice.
        </p>
      </div>
    </section>
  );
}
