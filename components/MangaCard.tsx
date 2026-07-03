import Link from "next/link";
import type { Manga } from "@/lib/manga";
import { mangaPath, pageUrl, unitLabelPlural } from "@/lib/site";
import { stats } from "@/lib/data";

export default function MangaCard({ manga, priority = false }: { manga: Manga; priority?: boolean }) {
  const live = manga.status === "live";
  const s = live ? stats(manga.slug) : null;

  return (
    <Link
      href={mangaPath(manga.slug)}
      aria-label={`Colorized ${manga.title} manga`}
      className="group relative block overflow-hidden rounded-2xl bg-ink-2 shadow-lg shadow-black/40 ring-1 ring-line/50 transition-transform duration-300 ease-out hover:z-10 hover:scale-[1.03] hover:ring-brand/40"
    >
      {/* Poster — shown at full brightness, nothing overlaid on the art. */}
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        {live ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={manga.poster ?? pageUrl(manga, 1, 1)}
            alt={`Colorized ${manga.title} manga cover — read ${manga.title} in full color`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            style={{ objectPosition: manga.posterPosition ?? "top" }}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center text-6xl"
            style={{
              background: `radial-gradient(120% 90% at 50% 0%, ${manga.accent}22, transparent 60%), linear-gradient(180deg, #14141b, #0b0b0f)`,
            }}
          >
            <span className="opacity-80 grayscale-[.2]">{manga.mark}</span>
          </div>
        )}
      </div>

      {/* Info — sits below the art so the color stays the star. */}
      <div className="p-4 sm:p-5">
        <h3 className="text-xl font-black leading-tight tracking-tight sm:text-2xl">
          {manga.title}
        </h3>
        <p className="mt-1 text-xs text-mute sm:text-sm">
          {manga.author}
          {live && s && (
            <>
              {" · "}
              {s.colored} {unitLabelPlural(manga)} in full color
            </>
          )}
          {!live && " · Colorization in progress"}
        </p>
        <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-2 sm:text-sm">
          {live ? "Read in full color" : "Preview"}
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
