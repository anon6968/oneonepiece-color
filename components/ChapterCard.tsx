import Link from "next/link";
import { pageUrl, readPath, unitLabel } from "@/lib/site";
import type { Manga } from "@/lib/manga";
import type { IndexEntry } from "@/lib/data";

function chapterRange(c: IndexEntry): string | null {
  if (c.chapterFrom != null && c.chapterTo != null) {
    return `Ch. ${c.chapterFrom}–${c.chapterTo}`;
  }
  return null;
}

export default function ChapterCard({
  manga,
  c,
  priority = false,
  variant = "grid",
  unavailable = false,
}: {
  manga: Manga;
  c: IndexEntry;
  priority?: boolean;
  variant?: "grid" | "row";
  unavailable?: boolean;
}) {
  const label = unitLabel(manga);
  const range = chapterRange(c);
  const href = unavailable ? undefined : readPath(manga, c.chapter);

  const inner = (
    <>
      <div
        className={
          variant === "row"
            ? "relative h-16 w-11 shrink-0 overflow-hidden rounded-md bg-ink-2 sm:h-[4.5rem] sm:w-12"
            : "relative aspect-[3/4] overflow-hidden bg-ink-2"
        }
      >
        {!unavailable ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={pageUrl(manga, c.chapter, 1)}
            alt={`${manga.title} color manga ${label} ${c.chapter}${c.title ? ` — ${c.title}` : ` — ${c.arc}`}`}
            width={c.coverW}
            height={c.coverH}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-ink-2 text-lg opacity-40">
            {manga.mark}
          </div>
        )}
        {variant === "grid" && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        )}
        {variant === "grid" && c.type === "partial" && !unavailable && (
          <span
            title="Some pages in this chapter are still being colored"
            className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-ink/70 px-1.5 py-0.5 text-[9px] font-medium text-bone/90 ring-1 ring-white/10 backdrop-blur-sm"
          >
            <span className="h-1 w-1 rounded-full bg-gold/70" />
            Partial
          </span>
        )}
        {unavailable && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-0.5 text-center text-[8px] font-bold uppercase tracking-wide text-mute">
            Soon
          </span>
        )}
        {variant === "grid" && (
          <div className="absolute inset-x-0 bottom-0 p-2.5">
            <div className="text-[13px] font-bold leading-tight">
              {label} {c.chapter}
            </div>
            <div className="truncate text-[11px] text-mute">{c.title ?? c.arc}</div>
            {range && <div className="mt-0.5 text-[10px] font-medium text-brand">{range}</div>}
          </div>
        )}
      </div>

      {variant === "row" && (
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-sm font-bold">
              {label} {c.chapter}
            </span>
            {range && (
              <span className="rounded-md bg-brand/15 px-1.5 py-0.5 text-[11px] font-semibold text-brand">
                {range}
              </span>
            )}
            {c.type === "partial" && !unavailable && (
              <span
                title="Some pages in this chapter are still being colored"
                className="inline-flex items-center gap-1 rounded-full bg-panel-2/70 px-1.5 py-0.5 text-[10px] font-medium text-mute"
              >
                <span className="h-1 w-1 rounded-full bg-gold/70" />
                Partial color
              </span>
            )}
            {unavailable && (
              <span className="text-[10px] font-bold uppercase text-mute">Colorization pending</span>
            )}
          </div>
          <div className="mt-0.5 truncate text-sm font-medium text-fg">
            {c.title ?? (unavailable ? `${label} ${c.chapter}` : c.arc)}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-2 text-xs text-mute">
            {!unavailable && c.saga !== "Upcoming" && <span>{c.arc}</span>}
            {!unavailable && c.pageCount > 0 && (
              <span>
                {c.pageCount} pages · {c.saga}
              </span>
            )}
            {unavailable && range && (
              <span>
                {c.arc} · {c.saga}
              </span>
            )}
          </div>
        </div>
      )}

      {variant === "row" && !unavailable && (
        <span className="hidden shrink-0 self-center text-xs font-semibold text-brand sm:inline">
          Read →
        </span>
      )}
    </>
  );

  const className =
    variant === "row"
      ? "group flex items-center gap-3 rounded-xl bg-panel/60 p-2.5 transition hover:bg-panel sm:gap-4 sm:p-3" +
        (unavailable ? " opacity-60" : " hover:-translate-y-px")
      : "group relative overflow-hidden rounded-lg bg-panel transition duration-300 hover:-translate-y-0.5";

  if (!href) {
    return <div className={className + " cursor-default"}>{inner}</div>;
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
