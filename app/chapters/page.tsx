import type { Metadata } from "next";
import { getIndex, stats } from "@/lib/data";
import { SITE } from "@/lib/site";
import ChapterBrowser from "@/components/ChapterBrowser";

export const metadata: Metadata = {
  title: "All One Piece Color Manga Chapters — Full Chapter List",
  description:
    "Complete list of every colorized One Piece manga chapter, organized by saga and arc. Jump to any chapter of One Piece in full color — East Blue, Alabasta, Marineford, Wano and more.",
  alternates: { canonical: "/chapters" },
};

export default function ChaptersPage() {
  const index = getIndex();
  const s = stats();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
      { "@type": "ListItem", position: 2, name: "All Chapters", item: `${SITE.url}/chapters` },
    ],
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="mb-2 text-xs text-mute" aria-label="Breadcrumb">
        <a href="/" className="hover:text-brand">Home</a> <span className="px-1">/</span> Chapters
      </nav>
      <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
        All One Piece color manga chapters
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-mute">
        Every colorized chapter we host — {s.total} chapters in color, up to chapter {s.last},
        grouped by saga. Tap any cover to start reading.
      </p>
      <div className="mt-6">
        <ChapterBrowser chapters={index} />
      </div>
    </div>
  );
}
