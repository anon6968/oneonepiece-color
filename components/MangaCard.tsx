import Link from "next/link";
import type { Manga } from "@/lib/manga";
import { mangaPath, pageUrl, unitLabelPlural } from "@/lib/site";
import { stats } from "@/lib/data";

const BADGE: Record<Manga["color"], { label: string; cls: string }> = {
  full: { label: "Full color", cls: "bg-emerald-500/90 text-black" },
  partial: { label: "Partial color", cls: "bg-amber-400/90 text-black" },
  none: { label: "B&W — not colorized", cls: "bg-zinc-600/90 text-white" },
};

export default function MangaCard({ manga, priority = false }: { manga: Manga; priority?: boolean }) {
  const live = manga.status === "live";
  const s = live ? stats(manga.slug) : null;
  const badge = BADGE[manga.color];

  // Honest one-line status under the title.
  let sub: string;
  if (live && s) {
    sub =
      manga.color === "full"
        ? `${s.colored} ${unitLabelPlural(manga)} in full color`
        : `${s.colored} colored ${unitLabelPlural(manga)}${manga.colorNote ? ` · ${manga.colorNote}` : ""}`;
  } else if (manga.color === "none") {
    sub = "No color version — black & white only";
  } else if (manga.color === "partial") {
    sub = manga.colorNote ?? "Partial color";
  } else {
    sub = "Full color — coming soon";
  }

  const cta = live ? "Read in full color" : manga.color === "none" ? "Details" : "Preview";

  return (
    <Link
      href={mangaPath(manga.slug)}
      aria-label={`${manga.title} manga — ${badge.label}`}
      className="group relative block overflow-hidden rounded-2xl bg-ink-2 shadow-lg shadow-black/40 ring-1 ring-line/50 transition-transform duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:ring-brand/40"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {/* Honesty badge — always shown so nothing is mistaken for full color. */}
        <span
          className={`absolute left-2.5 top-2.5 z-10 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide shadow-sm sm:text-xs ${badge.cls}`}
        >
          {badge.label}
        </span>
        {live ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={manga.poster ?? pageUrl(manga, 1, 1)}
            alt={`${manga.title} colored manga cover`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            style={{ objectPosition: manga.posterPosition ?? "top" }}
            className={`h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] ${
              manga.color === "none" ? "grayscale" : ""
            }`}
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center text-6xl"
            style={{
              background: `radial-gradient(120% 90% at 50% 0%, ${manga.accent}22, transparent 60%), linear-gradient(180deg, #14141b, #0b0b0f)`,
            }}
          >
            <span className={`opacity-80 ${manga.color === "none" ? "grayscale" : "grayscale-[.2]"}`}>
              {manga.mark}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="text-xl font-black leading-tight tracking-tight sm:text-2xl">{manga.title}</h3>
        <p className="mt-1 text-xs text-mute sm:text-sm">
          {manga.author} · {sub}
        </p>
        <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-2 sm:text-sm">
          {cta}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
