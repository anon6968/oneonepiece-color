"use client";

import { useMemo, useState } from "react";
import ChapterCard from "./ChapterCard";
import type { IndexEntry } from "@/lib/data";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function ChapterBrowser({ chapters }: { chapters: IndexEntry[] }) {
  const [q, setQ] = useState("");

  const query = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!query) return chapters;
    const asNum = parseInt(query, 10);
    return chapters.filter(
      (c) =>
        c.arc.toLowerCase().includes(query) ||
        c.saga.toLowerCase().includes(query) ||
        String(c.chapter) === query ||
        (!Number.isNaN(asNum) && String(c.chapter).startsWith(query)),
    );
  }, [chapters, query]);

  const groups = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, IndexEntry[]>();
    for (const c of filtered) {
      if (!map.has(c.saga)) {
        map.set(c.saga, []);
        order.push(c.saga);
      }
      map.get(c.saga)!.push(c);
    }
    return order.map((saga) => ({ saga, chapters: map.get(saga)! }));
  }, [filtered]);

  return (
    <div>
      <div className="sticky top-14 z-30 -mx-4 mb-6 bg-ink/90 px-4 py-3 backdrop-blur">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search chapters — number, arc or saga (e.g. “Marineford”, “1015”)"
          aria-label="Search chapters"
          className="w-full rounded-xl bg-panel px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/25"
        />
        <div className="mt-2 text-xs text-mute">
          {filtered.length} chapter{filtered.length === 1 ? "" : "s"}
          {query ? ` matching “${q}”` : " in full color"}
        </div>
      </div>

      {groups.length === 0 && (
        <p className="py-16 text-center text-mute">No chapters match that search.</p>
      )}

      <div className="space-y-10">
        {groups.map((g) => (
          <section key={g.saga} id={slug(g.saga)} className="scroll-mt-28">
            <div className="mb-4 flex items-baseline gap-3">
              <h2 className="text-lg font-bold sm:text-xl">{g.saga}</h2>
              <span className="text-xs text-mute">
                Ch. {g.chapters[0].chapter}–{g.chapters[g.chapters.length - 1].chapter}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {g.chapters.map((c) => (
                <ChapterCard key={c.chapter} c={c} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
