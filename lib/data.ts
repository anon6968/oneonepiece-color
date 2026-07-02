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
}

const DATA_DIR = path.join(process.cwd(), "data");

let _index: IndexEntry[] | null = null;

export function getIndex(): IndexEntry[] {
  if (_index) return _index;
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, "index.json"), "utf8");
    const parsed = JSON.parse(raw);
    _index = (parsed.chapters as IndexEntry[]).sort((a, b) => a.chapter - b.chapter);
  } catch {
    _index = [];
  }
  return _index;
}

export function getChapter(n: number): Chapter | null {
  try {
    const raw = fs.readFileSync(path.join(DATA_DIR, "chapters", `${n}.json`), "utf8");
    return JSON.parse(raw) as Chapter;
  } catch {
    return null;
  }
}

export function getChapterNumbers(): number[] {
  return getIndex().map((c) => c.chapter);
}

/** Neighbouring available chapters (they may not be strictly +/-1 due to B&W gaps). */
export function neighbours(n: number): { prev: number | null; next: number | null } {
  const nums = getChapterNumbers();
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

export function groupBySaga(): SagaGroup[] {
  const index = getIndex();
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

export function stats() {
  const index = getIndex();
  const colored = index.filter((c) => c.type === "color").length;
  const partial = index.filter((c) => c.type === "partial").length;
  const last = index.length ? index[index.length - 1].chapter : 0;
  const totalPages = index.reduce((s, c) => s + c.pageCount, 0);
  return { total: index.length, colored, partial, last, totalPages };
}
