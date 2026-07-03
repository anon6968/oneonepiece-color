"use client";

import Link from "next/link";
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
        className="rounded-xl bg-panel px-5 py-3 text-sm font-semibold text-fg transition hover:bg-panel-2"
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
      className="inline-flex items-center gap-2 rounded-xl bg-panel px-5 py-3 text-sm font-semibold text-fg ring-1 ring-line transition hover:bg-panel-2 hover:ring-brand/40"
    >
      <span className="h-1.5 w-1.5 shrink-0 animate-pulseGlow rounded-full bg-brand" aria-hidden />
      Resume {s.title} · {abbrev} {n}
    </Link>
  );
}
