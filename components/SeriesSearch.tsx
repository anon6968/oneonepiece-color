"use client";

import Link from "@/components/StaticLink";
import { useEffect, useMemo, useRef, useState } from "react";

/** One searchable series — the minimum the hub needs to render a result row. */
export type SearchItem = {
  slug: string;
  title: string;
  alt: string[];
  color: "full" | "partial" | "none";
  chapters: number;
};

/** Colored and black & white series searched together, in one box.
 *  Client-side over a small embedded index, so it works in the static export.
 *  The full server-rendered library stays in the HTML below — this only ever
 *  overlays results, so crawlers still see every series. */
export default function SeriesSearch({ items }: { items: SearchItem[] }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 1) return [];
    const scored: { it: SearchItem; score: number }[] = [];
    for (const it of items) {
      const hay = [it.title, ...it.alt].map((s) => s.toLowerCase());
      let best = -1;
      for (const h of hay) {
        const i = h.indexOf(needle);
        if (i === 0) best = Math.max(best, 2);
        else if (i > 0) best = Math.max(best, 1);
      }
      if (best >= 0) scored.push({ it, score: best });
    }
    return scored
      .sort((a, b) => b.score - a.score || a.it.title.localeCompare(b.it.title))
      .slice(0, 8)
      .map((s) => s.it);
  }, [q, items]);

  // Dismiss on outside click / Escape.
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const label = (c: SearchItem["color"]) =>
    c === "none" ? "B&W" : c === "partial" ? "Partly colored" : "Full color";

  return (
    <div ref={boxRef} className="relative mx-auto w-full max-w-xl">
      <input
        type="search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search all series — colored and black &amp; white"
        aria-label="Search all manga series, colored and black and white"
        className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-base
                   text-white placeholder:text-mute focus:border-white/35 focus:outline-none"
      />
      {open && q.trim().length > 0 && (
        <div
          role="listbox"
          className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border
                     border-white/15 bg-[#12121a] shadow-2xl"
        >
          {results.length === 0 ? (
            <p className="px-5 py-4 text-sm text-mute">No series match “{q}”.</p>
          ) : (
            results.map((r) => (
              <Link
                key={r.slug}
                href={`/${r.slug}`}
                className="flex items-center justify-between gap-3 px-5 py-3
                           hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                onClick={() => setOpen(false)}
              >
                <span className="truncate font-medium">{r.title}</span>
                <span className="shrink-0 text-xs text-mute">
                  {label(r.color)} · {r.chapters}
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
