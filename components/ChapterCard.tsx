import Link from "next/link";
import { chapterPath, pageUrl } from "@/lib/site";
import type { Manga } from "@/lib/manga";
import type { IndexEntry } from "@/lib/data";

export default function ChapterCard({
  manga,
  c,
  priority = false,
}: {
  manga: Manga;
  c: IndexEntry;
  priority?: boolean;
}) {
  return (
    <Link
      href={chapterPath(manga.slug, c.chapter)}
      className="group relative overflow-hidden rounded-lg bg-panel transition duration-300 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-ink-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pageUrl(manga, c.chapter, 1)}
          alt={`${manga.title} color manga Chapter ${c.chapter} — ${c.arc}`}
          width={c.coverW}
          height={c.coverH}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        {c.type === "partial" && (
          <span className="absolute left-2 top-2 rounded-md bg-gold/90 px-1.5 py-0.5 text-[10px] font-bold text-ink">
            PARTIAL COLOR
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <div className="text-[13px] font-bold leading-tight">Chapter {c.chapter}</div>
          <div className="truncate text-[11px] text-mute">{c.arc}</div>
        </div>
      </div>
    </Link>
  );
}
