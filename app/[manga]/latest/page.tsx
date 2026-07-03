import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getManga, getMangaSlugs, isLive } from "@/lib/manga";
import { getIndex, stats } from "@/lib/data";
import {
  SITE,
  latestPath,
  listPath,
  mangaPath,
  pageUrl,
  readPath,
  unitLabel,
  unitLabelPlural,
} from "@/lib/site";

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
  const plural = unitLabelPlural(m);
  const title = `Latest ${m.title} Colored ${unitLabel(m)}s — Newest ${m.title} in Color`;
  const description = `The latest colorized ${m.title} manga ${plural}, newest first. Read the most recent ${m.title} ${plural} in full color online free.`;
  return {
    title,
    description,
    keywords: [
      `latest ${m.title.toLowerCase()} colored ${unitLabel(m).toLowerCase()}`,
      `newest ${m.title.toLowerCase()} color ${unitLabel(m).toLowerCase()}`,
      `${m.title.toLowerCase()} latest ${unitLabel(m).toLowerCase()} color`,
      `new ${m.title.toLowerCase()} colored manga`,
    ],
    alternates: { canonical: latestPath(slug) },
    robots: isLive(m) ? undefined : { index: false },
  };
}

export default async function LatestPage({
  params,
}: {
  params: Promise<{ manga: string }>;
}) {
  const { manga: slug } = await params;
  const m = getManga(slug);
  if (!m) notFound();

  const index = getIndex(slug);
  const s = stats(slug);
  const latest = [...index].reverse();
  const label = unitLabel(m);
  const plural = unitLabelPlural(m);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: m.title, item: `${SITE.url}${mangaPath(slug)}` },
      { "@type": "ListItem", position: 3, name: "Latest", item: `${SITE.url}${latestPath(slug)}` },
    ],
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav className="mb-2 text-xs text-mute" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand">Home</Link>
        <span className="px-1">/</span>
        <Link href={mangaPath(slug)} className="hover:text-brand">{m.title}</Link>
        <span className="px-1">/</span> Latest
      </nav>
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
        Latest {m.title} colored {plural}
      </h1>

      {isLive(m) && latest.length > 0 ? (
        <>
          <p className="mt-2 text-sm text-mute">
            The newest colorized {m.title} {plural}, most recent first — updated through{" "}
            {label.toLowerCase()} {s.last}.{" "}
            <Link href={listPath(m)} className="text-brand hover:underline">
              Browse the full list by arc →
            </Link>
          </p>
          <ol className="mt-6 divide-y divide-line/40 overflow-hidden rounded-xl bg-panel/40">
            {latest.map((c) => (
              <li key={c.chapter}>
                <Link
                  href={readPath(m, c.chapter)}
                  className="flex items-center gap-3 px-3 py-2.5 transition hover:bg-panel"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pageUrl(m, c.chapter, 1)}
                    alt={`${m.title} colored ${label.toLowerCase()} ${c.chapter} — ${c.title ?? c.arc}`}
                    loading="lazy"
                    decoding="async"
                    className="h-14 w-10 flex-none rounded object-cover object-top bg-ink-2"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold">
                      {m.title} {label} {c.chapter}
                      {c.title && <span className="text-mute"> — {c.title}</span>}
                      {c.type === "partial" && (
                        <span className="ml-2 rounded bg-gold/90 px-1 py-0.5 text-[10px] font-bold text-ink">
                          PARTIAL
                        </span>
                      )}
                    </div>
                    <div className="truncate text-xs text-mute">
                      {c.arc === c.saga ? c.arc : `${c.arc} · ${c.saga}`} · {c.pageCount} pages
                    </div>
                  </div>
                  <span className="flex-none text-xs font-semibold text-brand">Read →</span>
                </Link>
              </li>
            ))}
          </ol>
        </>
      ) : (
        <p className="mt-4 text-sm text-mute">
          The colorized {m.title} manga is being prepared — the latest colored {plural} will appear
          here first.{" "}
          <Link href={mangaPath(slug)} className="text-brand hover:underline">
            See the {m.title} preview →
          </Link>
        </p>
      )}
    </div>
  );
}
