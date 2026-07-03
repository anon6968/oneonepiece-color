import fs from "node:fs";
import path from "node:path";

export type ChapterType = "color" | "partial";

export interface IndexEntry {
  chapter: number;
  type: ChapterType;
  pageCount: number;
  arc: string;
  saga: string;
  coverW: number;
  coverH: number;
  /** Optional unit title (e.g. Naruto volume names like "Uzumaki Naruto"). */
  title?: string;
}

export interface PageMeta {
  n: number;
  w: number;
  h: number;
}

export interface Chapter {
  chapter: number;
  type: ChapterType;
  pageCount: number;
  arc: string;
  saga: string;
  pages: PageMeta[];
  /** Optional unit title (e.g. Naruto volume names like "Uzumaki Naruto"). */
  title?: string;
}

const DATA_DIR = path.join(process.cwd(), "data", "manga");

function mangaDir(slug: string) {
  return path.join(DATA_DIR, slug);
}

const _indexCache = new Map<string, IndexEntry[]>();

export function getIndex(slug: string): IndexEntry[] {
  const cached = _indexCache.get(slug);
  if (cached) return cached;
  let index: IndexEntry[];
  try {
    const raw = fs.readFileSync(path.join(mangaDir(slug), "index.json"), "utf8");
    const parsed = JSON.parse(raw);
    index = (parsed.chapters as IndexEntry[]).sort((a, b) => a.chapter - b.chapter);
  } catch {
    index = [];
  }
  _indexCache.set(slug, index);
  return index;
}

export function getChapter(slug: string, n: number): Chapter | null {
  try {
    const raw = fs.readFileSync(
      path.join(mangaDir(slug), "chapters", `${n}.json`),
      "utf8",
    );
    return JSON.parse(raw) as Chapter;
  } catch {
    return null;
  }
}

export function getChapterNumbers(slug: string): number[] {
  return getIndex(slug).map((c) => c.chapter);
}

/** Neighbouring available chapters (may not be strictly +/-1 due to gaps). */
export function neighbours(slug: string, n: number): { prev: number | null; next: number | null } {
  const nums = getChapterNumbers(slug);
  const i = nums.indexOf(n);
  if (i === -1) {
    const prev = [...nums].reverse().find((x) => x < n) ?? null;
    const next = nums.find((x) => x > n) ?? null;
    return { prev, next };
  }
  return { prev: i > 0 ? nums[i - 1] : null, next: i < nums.length - 1 ? nums[i + 1] : null };
}

export interface SagaGroup {
  saga: string;
  arcs: { arc: string; chapters: IndexEntry[] }[];
  chapters: IndexEntry[];
}

export function groupBySaga(slug: string): SagaGroup[] {
  const index = getIndex(slug);
  const order: string[] = [];
  const map = new Map<string, IndexEntry[]>();
  for (const c of index) {
    if (!map.has(c.saga)) {
      map.set(c.saga, []);
      order.push(c.saga);
    }
    map.get(c.saga)!.push(c);
  }
  return order.map((saga) => {
    const chapters = map.get(saga)!;
    const arcOrder: string[] = [];
    const arcMap = new Map<string, IndexEntry[]>();
    for (const c of chapters) {
      if (!arcMap.has(c.arc)) {
        arcMap.set(c.arc, []);
        arcOrder.push(c.arc);
      }
      arcMap.get(c.arc)!.push(c);
    }
    return {
      saga,
      chapters,
      arcs: arcOrder.map((arc) => ({ arc, chapters: arcMap.get(arc)! })),
    };
  });
}

export interface MangaStats {
  total: number;
  colored: number;
  partial: number;
  last: number;
  totalPages: number;
}

export function stats(slug: string): MangaStats {
  const index = getIndex(slug);
  const colored = index.filter((c) => c.type === "color").length;
  const partial = index.filter((c) => c.type === "partial").length;
  const last = index.length ? index[index.length - 1].chapter : 0;
  const totalPages = index.reduce((s, c) => s + c.pageCount, 0);
  return { total: index.length, colored, partial, last, totalPages };
}

export function sagaSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
