"use client";

import Link from "@/components/StaticLink";
import { useEffect, useState } from "react";
import { loadProgress } from "@/components/reader/prefs";

interface Series {
  slug: string;
  title: string;
  unit: "chapter" | "volume";
}

interface Hit {
  series: Series;
  n: number;
  page: number;
  ts: number;
}

/** The hero's secondary button. First-time visitors (and SSR) get
 *  "Browse all manga"; returning readers get a resume link to the most
 *  recently read chapter across all live series instead. */
export default function ContinueReading({ series }: { series: Series[] }) {
  const [hit, setHit] = useState<Hit | null>(null);

  useEffect(() => {
    let best: Hit | null = null;
    for (const s of series) {
      const p = loadProgress(s.slug);
      if (p && (!best || p.ts > best.ts)) best = { series: s, n: p.n, page: p.page, ts: p.ts };
    }
    setHit(best);
  }, [series]);

  if (!hit) {
    return (
      <Link
        href="#library"
        className="inline-flex items-center rounded-xl bg-panel px-6 py-3.5 text-[15px] font-semibold text-fg ring-1 ring-line transition hover:bg-panel-2 hover:ring-brand/40"
      >
        Browse all manga
      </Link>
    );
  }

  const { series: s, n } = hit;
  const abbrev = s.unit === "volume" ? "Vol." : "Ch.";

  return (
    <Link
      href={`/${s.slug}/${s.unit}/${n}`}
      className="group inline-flex items-center gap-2.5 rounded-xl bg-brand/10 px-6 py-3.5 text-[15px] font-bold text-fg ring-1 ring-brand/40 shadow-lg shadow-brand/10 transition hover:bg-brand/20 hover:ring-brand/70 hover:shadow-brand/25"
    >
      <span
        aria-hidden
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-[10px] text-white shadow shadow-brand/40 transition group-hover:brightness-110"
      >
        ▶
      </span>
      Resume {s.title} · {abbrev} {n}
    </Link>
  );
}
