"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadProgress } from "@/components/reader/prefs";

interface Series {
  slug: string;
  title: string;
  unit: "chapter" | "volume";
  poster: string;
}

interface Hit {
  series: Series;
  n: number;
  ts: number;
}

/** Fixed-size "Continue reading" pill for the header. Shows the single most
 *  recently read series across the whole library (with its cover), so the nav
 *  never grows a button per title as more manga are added. Renders nothing
 *  until the reader actually has progress. */
export default function HeaderResume({ series }: { series: Series[] }) {
  const [hit, setHit] = useState<Hit | null>(null);

  useEffect(() => {
    let best: Hit | null = null;
    for (const s of series) {
      const p = loadProgress(s.slug);
      if (p && (!best || p.ts > best.ts)) best = { series: s, n: p.n, ts: p.ts };
    }
    setHit(best);
  }, [series]);

  if (!hit) return null;

  const { series: s, n } = hit;
  const abbrev = s.unit === "volume" ? "Vol." : "Ch.";

  return (
    <Link
      href={`/${s.slug}/${s.unit}/${n}`}
      aria-label={`Continue reading ${s.title} ${abbrev} ${n}`}
      className="ml-auto hidden items-center gap-2.5 rounded-xl bg-panel/80 py-1.5 pl-1.5 pr-3 ring-1 ring-line/60 transition hover:bg-panel-2 hover:ring-brand/40 sm:flex"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={s.poster}
        alt=""
        width={28}
        height={36}
        className="h-9 w-7 shrink-0 rounded-md object-cover object-top"
      />
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] uppercase tracking-wide text-mute">Continue reading</span>
        <span className="text-xs font-semibold text-fg">
          {s.title} · {abbrev} {n}
        </span>
      </span>
    </Link>
  );
}
