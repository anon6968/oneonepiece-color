"use client";

import { useMemo, useState } from "react";
import ChapterCard from "./ChapterCard";
import { unitLabel, unitLabelPlural } from "@/lib/site";
import { NARUTO_TOTAL_VOLUMES, NARUTO_VOLUME_CHAPTERS, narutoVolumeMeta } from "@/lib/naruto-volumes";
import type { Manga } from "@/lib/manga";
import type { IndexEntry } from "@/lib/data";

export type BrowseFilter = "all" | "color" | "full";
export type ViewMode = "sagas" | "arcs" | "list" | "grid";

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function chapterRangeLabel(c: IndexEntry): string | null {
  if (c.chapterFrom != null && c.chapterTo != null) {
    return `Ch. ${c.chapterFrom}–${c.chapterTo}`;
  }
  return null;
}

function buildPlaceholders(manga: Manga, existing: IndexEntry[]): IndexEntry[] {
  const byNum = new Map(existing.map((c) => [c.chapter, c]));
  const total =
    manga.slug === "naruto" && manga.unit === "volume"
      ? NARUTO_TOTAL_VOLUMES
      : manga.totalChapters ?? existing.length;

  const placeholders: IndexEntry[] = [];
  for (let n = 1; n <= total; n++) {
    if (byNum.has(n)) continue;
    const arcMeta =
      manga.slug === "naruto" ? NARUTO_VOLUME_CHAPTERS[n] : undefined;
    const { arc, saga } =
      manga.slug === "naruto" ? narutoVolumeMeta(n) : { arc: "Coming soon", saga: "Upcoming" };
    placeholders.push({
      chapter: n,
      type: "partial",
      pageCount: 0,
      arc,
      saga,
      coverW: 1080,
      coverH: 1662,
      chapterFrom: arcMeta?.from,
      chapterTo: arcMeta?.to,
    });
  }
  return placeholders;
}

/* --------------------------- small primitives --------------------------- */

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: T; label: string; hint?: string }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex rounded-xl border border-line/60 bg-ink-2/70 p-0.5"
    >
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="tab"
            aria-selected={active}
            title={o.hint}
            onClick={() => onChange(o.id)}
            className={
              "rounded-[10px] px-3 py-1.5 text-[13px] font-medium transition sm:px-3.5 " +
              (active
                ? "bg-panel text-fg shadow-[0_1px_2px_rgba(0,0,0,0.35)] ring-1 ring-line/70"
                : "text-mute hover:text-fg")
            }
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="14"
      height="14"
      aria-hidden
      className={"shrink-0 text-mute transition-transform duration-200 " + (open ? "rotate-90" : "")}
    >
      <path
        d="M6 4l4 4-4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------- browser ------------------------------- */

export default function ChapterBrowser({
  manga,
  chapters,
}: {
  manga: Manga;
  chapters: IndexEntry[];
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<BrowseFilter>("all");
  const [view, setView] = useState<ViewMode>("sagas");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const label = unitLabel(manga);
  const plural = unitLabelPlural(manga);

  const totalExpected =
    manga.slug === "naruto" && manga.unit === "volume"
      ? NARUTO_TOTAL_VOLUMES
      : manga.totalChapters;

  const source = useMemo(() => {
    // "In color" narrows to fully-coloured units only.
    if (filter === "color") {
      return chapters.filter((c) => c.type === "color");
    }
    // "Full series" adds the not-yet-coloured roadmap placeholders.
    if (filter === "full" && totalExpected) {
      return [...chapters, ...buildPlaceholders(manga, chapters)].sort(
        (a, b) => a.chapter - b.chapter,
      );
    }
    // Default "All": everything we host, first → last (colour + partial).
    return chapters;
  }, [chapters, filter, manga, totalExpected]);

  const query = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!query) return source;
    const asNum = parseInt(query, 10);
    return source.filter(
      (c) =>
        c.arc.toLowerCase().includes(query) ||
        c.saga.toLowerCase().includes(query) ||
        (c.title ?? "").toLowerCase().includes(query) ||
        (chapterRangeLabel(c) ?? "").toLowerCase().includes(query) ||
        String(c.chapter) === query ||
        (!Number.isNaN(asNum) && String(c.chapter).startsWith(query)),
    );
  }, [source, query]);

  // Group by the active grouping key (saga or arc), preserving natural order.
  const groups = useMemo(() => {
    const order: string[] = [];
    const map = new Map<string, IndexEntry[]>();
    for (const c of filtered) {
      const raw = view === "arcs" ? c.arc : c.saga;
      const key = c.saga === "Upcoming" && c.pageCount === 0 ? "Upcoming" : raw;
      if (!map.has(key)) {
        map.set(key, []);
        order.push(key);
      }
      map.get(key)!.push(c);
    }
    return order.map((name) => ({ name, chapters: map.get(name)! }));
  }, [filtered, view]);

  const grouped = view === "sagas" || view === "arcs";

  const filterTabs: { id: BrowseFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: chapters.length },
    { id: "color", label: "In color", count: chapters.filter((c) => c.type === "color").length },
    { id: "full", label: "Full series", count: totalExpected ?? chapters.length },
  ];

  const viewOptions: { id: ViewMode; label: string; hint: string }[] = [
    { id: "sagas", label: "Sagas", hint: `Group ${plural} by saga` },
    { id: "arcs", label: "Arcs", hint: `Group ${plural} by story arc` },
    { id: "list", label: "List", hint: `Every ${label.toLowerCase()}, one continuous list` },
    { id: "grid", label: "Grid", hint: "Cover wall — the whole series at a glance" },
  ];

  function toggle(name: string) {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div>
      {/* Toolbar — pins to the very top of the viewport (the site header
          scrolls away, giving the list the room). Fully opaque and
          full-bleed so cards never show through it, and kept slim on
          phones: search on top, then one swipeable row of view tabs +
          filters. The meta line below is NOT sticky, so scrolling costs
          the least screen possible. */}
      <div className="sticky top-0 z-30 -mx-4 mb-2 border-b border-line/60 bg-ink px-4 py-2.5 sm:py-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          {/* Search — first (row of its own) on phones, middle on desktop */}
          <div className="relative min-w-0 flex-1 sm:order-2">
            <svg
              viewBox="0 0 20 20"
              width="16"
              height="16"
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mute"
            >
              <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M14 14l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Search ${plural} — number, title or arc`}
              aria-label={`Search ${manga.title} ${plural}`}
              className="w-full rounded-xl border border-line/50 bg-ink-2/60 py-2 pl-9 pr-8 text-sm text-fg outline-none transition placeholder:text-mute/70 focus:border-brand/50 focus:bg-ink-2 focus:ring-2 focus:ring-brand/25"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-mute transition hover:bg-panel-2 hover:text-fg"
              >
                <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* View tabs + filters — one horizontally swipeable row on phones;
              on sm+ this wrapper dissolves (display:contents) and the two
              groups flank the search bar via order. */}
          <div className="no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 sm:contents">
            <div className="shrink-0 sm:order-1">
              <Segmented options={viewOptions} value={view} onChange={setView} label="View mode" />
            </div>

            <span className="h-5 w-px shrink-0 bg-line/70 sm:hidden" aria-hidden />

            <div className="flex shrink-0 gap-1.5 sm:order-3">
              {filterTabs.map((tab) => {
                const active = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setFilter(tab.id)}
                    className={
                      "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition " +
                      (active
                        ? "bg-brand/15 text-brand ring-1 ring-brand/40"
                        : "text-mute hover:bg-panel-2 hover:text-fg")
                    }
                  >
                    {tab.label}
                    <span className={active ? "opacity-80" : "opacity-60"}>{tab.count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Meta line — scrolls away with the page */}
      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mute">
        <span>
          <span className="font-semibold text-fg">{filtered.length}</span>{" "}
          {filtered.length === 1 ? label.toLowerCase() : plural}
          {query ? ` matching “${q}”` : filter === "full" ? " in the roadmap" : " ready to read"}
        </span>
        {filter === "full" && totalExpected && chapters.length < totalExpected && (
          <span className="text-gold">
            {chapters.length} live · {totalExpected - chapters.length} upcoming
          </span>
        )}
        {grouped && groups.length > 1 && (
          <button
            type="button"
            onClick={() =>
              setCollapsed((prev) =>
                prev.size >= groups.length ? new Set() : new Set(groups.map((g) => g.name)),
              )
            }
            className="ml-auto rounded-md px-1.5 py-0.5 font-medium text-mute transition hover:text-fg"
          >
            {collapsed.size >= groups.length ? "Expand all" : "Collapse all"}
          </button>
        )}
      </div>

      {/* Empty state */}
      {groups.length === 0 && (
        <p className="py-16 text-center text-mute">
          No {plural} match that search.
        </p>
      )}

      {/* GRID — whole series, cover wall */}
      {view === "grid" && filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 xl:grid-cols-5">
          {filtered.map((c, i) => (
            <ChapterCard
              key={c.chapter}
              manga={manga}
              c={c}
              priority={i < 6}
              variant="grid"
              unavailable={c.pageCount === 0}
            />
          ))}
        </div>
      )}

      {/* LIST — every unit, flat and continuous */}
      {view === "list" && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map((c) => (
            <ChapterCard
              key={c.chapter}
              manga={manga}
              c={c}
              variant="row"
              unavailable={c.pageCount === 0}
            />
          ))}
        </div>
      )}

      {/* SAGAS / ARCS — grouped, collapsible sections */}
      {grouped && (
        <div className="space-y-4">
          {groups.map((g) => {
            const first = g.chapters[0];
            const last = g.chapters[g.chapters.length - 1];
            const isUpcoming = first.saga === "Upcoming";
            const inColor = g.chapters.filter((c) => c.pageCount > 0).length;
            const open = !collapsed.has(g.name);
            return (
              <section key={g.name} id={slug(g.name)} className="scroll-mt-32">
                <button
                  type="button"
                  onClick={() => toggle(g.name)}
                  aria-expanded={open}
                  className="group flex w-full items-center gap-3 rounded-xl px-1 py-2 text-left transition hover:bg-panel/40"
                >
                  <Chevron open={open} />
                  <h2 className="text-base font-semibold tracking-tight text-fg sm:text-[17px]">
                    {g.name}
                  </h2>
                  {!isUpcoming && (
                    <span className="text-xs text-mute">
                      {label}s {first.chapter}–{last.chapter}
                      <span className="mx-1.5 text-line">·</span>
                      {inColor} in color
                    </span>
                  )}
                  <span className="ml-auto rounded-full bg-panel-2/70 px-2 py-0.5 text-[11px] font-medium text-mute">
                    {g.chapters.length}
                  </span>
                </button>

                {open && (
                  <div className="mt-1.5 space-y-2 border-l border-line/40 pl-3 sm:pl-4">
                    {g.chapters.map((c) => (
                      <ChapterCard
                        key={c.chapter}
                        manga={manga}
                        c={c}
                        variant="row"
                        unavailable={c.pageCount === 0}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
