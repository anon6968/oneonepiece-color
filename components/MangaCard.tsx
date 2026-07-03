import Link from "next/link";
import type { Manga } from "@/lib/manga";
import { mangaPath, pageUrl } from "@/lib/site";
import { stats } from "@/lib/data";

export default function MangaCard({ manga, priority = false }: { manga: Manga; priority?: boolean }) {
  const live = manga.status === "live";
  const s = live ? stats(manga.slug) : null;

  return (
    <Link
      href={mangaPath(manga.slug)}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-panel transition duration-300 hover:-translate-y-1 hover:bg-panel-2"
      aria-label={`Colorized ${manga.title} manga`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-ink-2">
        {live ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pageUrl(manga, 1, 1)}
            alt={`Colorized ${manga.title} manga cover — read ${manga.title} in full color`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div
            className="grid h-full w-full place-items-center text-5xl"
            style={{
              background: `radial-gradient(120% 90% at 50% 0%, ${manga.accent}22, transparent 60%), linear-gradient(180deg, #14141b, #0b0b0f)`,
            }}
          >
            <span className="opacity-80 grayscale-[.2]">{manga.mark}</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

        <span
          className={
            "absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide " +
            (live ? "bg-brand text-white" : "bg-ink/70 text-mute backdrop-blur-sm")
          }
        >
          {live ? (
            <>
              <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-white align-middle animate-pulseGlow" />
              In color
            </>
          ) : (
            "Coming soon"
          )}
        </span>

        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="text-base font-black leading-tight drop-shadow">{manga.title}</div>
          <div className="mt-0.5 text-[11px] text-mute">
            {live && s
              ? `${s.colored} chapters in full color`
              : "Colorization in progress"}
          </div>
        </div>
      </div>

      <div className="flex-1 p-3">
        <p className="line-clamp-2 text-xs leading-relaxed text-mute">{manga.tagline}</p>
        <div className="mt-2.5 text-xs font-semibold text-brand">
          {live ? "Read in color →" : "Preview →"}
        </div>
      </div>
    </Link>
  );
}
