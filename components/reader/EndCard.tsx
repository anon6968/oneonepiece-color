import Link from "@/components/StaticLink";
import { listPath, readPath, unitLabel, unitLabelLower, unitLabelPlural } from "@/lib/site";
import type { Manga } from "@/lib/manga";
import type { ChapterType } from "@/lib/data";

interface Props {
  manga: Manga;
  chapter: number;
  next: number | null;
  total: number;
  totalUnits: number;
  type: ChapterType;
}

/** Shown after the last page (strip) or as the final slide (paged). */
export default function EndCard({ manga, chapter, next, total, totalUnits, type }: Props) {
  const unit = unitLabel(manga);
  const edition = type === "color" ? "in color" : type === "partial" ? "partially colored" : "in black & white";
  return (
    <div className="rounded-2xl border border-line bg-panel/90 p-6 text-center shadow-2xl">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-mute">
        End of {unit} {chapter}
      </p>

      {next ? (
        <Link
          href={readPath(manga, next)}
          className="mt-4 block rounded-xl bg-brand px-4 py-3.5 text-sm font-bold text-white transition hover:bg-brand-2 active:scale-[0.98]"
        >
          Continue to {unit} {next} →
        </Link>
      ) : (
        <p className="mt-4 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3.5 text-sm font-semibold text-gold">
          You&apos;re caught up — {unit.toLowerCase()} {chapter} of {total} is the latest available.
        </p>
      )}

      <p className="mt-4 text-xs text-mute">
        {totalUnits} available {unitLabelPlural(manga)} · this {unit.toLowerCase()} is {edition} ·{" "}
        <Link href={listPath(manga)} className="text-brand hover:underline">
          all {manga.title} {unitLabelPlural(manga)}
        </Link>
      </p>
      <p className="sr-only">
        Read {manga.title} {unitLabelLower(manga)} {chapter} {edition} online free.
      </p>
    </div>
  );
}
