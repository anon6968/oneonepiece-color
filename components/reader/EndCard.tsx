import Link from "next/link";
import { listPath, readPath, unitLabel, unitLabelLower, unitLabelPlural } from "@/lib/site";
import type { Manga } from "@/lib/manga";

interface Props {
  manga: Manga;
  chapter: number;
  next: number | null;
  total: number;
  totalUnits: number;
}

/** Shown after the last page (strip) or as the final slide (paged). */
export default function EndCard({ manga, chapter, next, total, totalUnits }: Props) {
  const unit = unitLabel(manga);
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
          You&apos;re caught up — {unit.toLowerCase()} {chapter} of {total} is the latest colorized.
        </p>
      )}

      <p className="mt-4 text-xs text-mute">
        {totalUnits} colorized {unitLabelPlural(manga)} ·{" "}
        <Link href={listPath(manga)} className="text-brand hover:underline">
          all {manga.title} {unitLabelPlural(manga)}
        </Link>
      </p>
      <p className="sr-only">
        Read {manga.title} {unitLabelLower(manga)} {chapter} colored online free.
      </p>
    </div>
  );
}
