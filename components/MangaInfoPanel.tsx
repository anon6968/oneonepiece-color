import Link from "next/link";
import type { Manga } from "@/lib/manga";
import type { MangaStats } from "@/lib/data";
import { pageUrl, readPath, unitLabel, unitLabelPlural } from "@/lib/site";
import ChapterJump from "./ChapterJump";

export default function MangaInfoPanel({
  manga,
  stats: s,
  firstChapter,
}: {
  manga: Manga;
  stats: MangaStats;
  firstChapter: number;
}) {
  const label = unitLabel(manga);
  const plural = unitLabelPlural(manga);
  const totalExpected = manga.totalChapters;
  const progressPct =
    totalExpected && totalExpected > 0
      ? Math.round((s.colored / totalExpected) * 100)
      : null;

  return (
    <aside className="no-scrollbar lg:sticky lg:top-[4.5rem] lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto">
      <div className="rounded-2xl bg-panel/80 p-5 sm:p-6">
        <div className="relative mx-auto max-w-[220px] overflow-hidden rounded-xl bg-ink-2 shadow-lg sm:max-w-none lg:max-w-[280px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pageUrl(manga, firstChapter, 1)}
            alt={`Colorized ${manga.title} cover`}
            width={1080}
            height={1662}
            className="aspect-[3/4] w-full object-cover object-top"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: `inset 0 0 0 1px ${manga.accent}22, inset 0 -40% 60% -20% ${manga.accent}18`,
            }}
          />
        </div>

        <div className="mt-5">
          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: `${manga.accent}18`, color: manga.accent }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulseGlow"
              style={{ background: manga.accent }}
            />
            {s.colored} {plural} in full color
            {totalExpected ? ` · ${progressPct}% of series` : ""}
          </span>

          <h1 className="mt-4 text-2xl font-black leading-tight tracking-tight sm:text-3xl">
            Colorized <span style={{ color: manga.accent }}>{manga.title}</span>
          </h1>
          {manga.nativeTitle && (
            <p className="mt-1 text-sm text-mute">{manga.nativeTitle}</p>
          )}
          <p className="mt-3 text-sm leading-relaxed text-mute">{manga.tagline}</p>
        </div>

        {totalExpected && s.colored < totalExpected && (
          <div className="mt-4">
            <div className="mb-1.5 flex justify-between text-[11px] text-mute">
              <span>
                {label} {s.last} of {totalExpected}
              </span>
              <span>{progressPct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-ink-2">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progressPct}%`, background: manga.accent }}
              />
            </div>
            <p className="mt-2 text-xs text-mute">
              {totalExpected - s.colored} more {plural} in progress.
            </p>
          </div>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3.5 border-t border-line/50 pt-5 text-sm">
          {[
            ["Author", manga.author],
            ["Publisher", manga.publisher],
            ["Since", String(manga.year)],
            ["Pages", s.totalPages.toLocaleString()],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-[10px] uppercase tracking-wider text-mute">{k}</dt>
              <dd className="mt-0.5 font-semibold leading-snug">{v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-[11px] leading-relaxed text-mute">
          {manga.genres.join(" · ")}
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            href={readPath(manga, firstChapter)}
            className="rounded-xl px-4 py-3 text-center text-sm font-bold text-white shadow-lg transition hover:brightness-110"
            style={{
              background: `linear-gradient(135deg, ${manga.accent}, ${manga.accent}cc)`,
              boxShadow: `0 8px 24px ${manga.accent}33`,
            }}
          >
            Start · {label} {firstChapter} →
          </Link>
          {s.last > firstChapter && (
            <Link
              href={readPath(manga, s.last)}
              className="rounded-xl bg-ink-2 px-4 py-2.5 text-center text-sm font-semibold transition hover:bg-panel-2"
            >
              Latest · {label} {s.last}
            </Link>
          )}
          <ChapterJump manga={manga} max={s.last} />
        </div>

        <p className="mt-6 border-t border-line/50 pt-5 text-xs leading-relaxed text-mute">
          {manga.synopsis}
        </p>
      </div>
    </aside>
  );
}
