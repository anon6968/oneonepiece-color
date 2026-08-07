"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { readPath, unitAbbrev, unitLabelPlural } from "@/lib/site";
import type { Manga } from "@/lib/manga";
import type { ChapterType } from "@/lib/data";

interface Props {
  manga: Manga;
  units: number[];
  unitTypes: Record<number, ChapterType>;
  unitTitles?: Record<number, string>;
  current: number;
  onClose: () => void;
}

/** Unit picker — bottom sheet on phones, floating panel on desktop. Chip
 *  grid for numbered chapters, titled rows for volume series. */
export default function ChapterMenu({ manga, units, unitTypes, unitTitles, current, onClose }: Props) {
  const currentRef = useRef<HTMLAnchorElement>(null);
  const hasTitles = !!unitTitles && Object.keys(unitTitles).length > 0;
  const abbrev = unitAbbrev(manga);
  const colored = units.filter((unit) => unitTypes[unit] === "color").length;
  const summary = colored === units.length
    ? `${units.length} colorized`
    : `${units.length} available · ${colored} colorized`;
  const typeLabel = (unit: number) =>
    unitTypes[unit] === "color"
      ? "Color"
      : unitTypes[unit] === "partial"
        ? "Partial color"
        : "B&W";

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: "center" });
  }, []);

  return (
    <>
      <div className="absolute inset-0 z-40 bg-ink/70" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-label={`All ${manga.title} ${unitLabelPlural(manga)}`}
        className="absolute inset-x-0 bottom-0 z-50 flex max-h-[72%] flex-col rounded-t-2xl border-t border-line bg-panel shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-4 sm:w-[26rem] sm:rounded-2xl sm:border"
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="text-sm font-bold">
            {manga.title} <span className="text-mute">· {summary}</span>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-mute transition hover:bg-panel-2 hover:text-fg"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {hasTitles ? (
            <div className="flex flex-col gap-1">
              {units.map((n) => (
                <Link
                  key={n}
                  ref={n === current ? currentRef : undefined}
                  href={readPath(manga, n)}
                  prefetch={false}
                  onClick={onClose}
                  className={`flex items-baseline gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                    n === current
                      ? "bg-brand font-bold text-white"
                      : "bg-panel-2/60 text-fg hover:bg-panel-2"
                  }`}
                  aria-label={`${abbrev} ${n} — ${typeLabel(n)}`}
                >
                  <span className="shrink-0 tabular-nums">
                    {abbrev} {n}
                  </span>
                  {unitTitles?.[n] && (
                    <span className={`truncate text-xs ${n === current ? "text-white/80" : "text-mute"}`}>
                      {unitTitles[n]}
                    </span>
                  )}
                  <span className={`ml-auto shrink-0 text-[10px] ${n === current ? "text-white/80" : "text-mute"}`}>
                    {typeLabel(n)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-6">
              {units.map((n) => (
                <Link
                  key={n}
                  ref={n === current ? currentRef : undefined}
                  href={readPath(manga, n)}
                  prefetch={false}
                  onClick={onClose}
                  className={`rounded-lg py-2 text-center text-xs tabular-nums transition ${
                    n === current
                      ? "bg-brand font-bold text-white"
                      : "bg-panel-2/60 text-fg hover:bg-panel-2"
                  }`}
                  aria-label={`${abbrev} ${n} — ${typeLabel(n)}`}
                  title={typeLabel(n)}
                >
                  {n}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
