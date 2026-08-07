import type { Manga } from "@/lib/manga";
import type { ChapterType, PageMeta } from "@/lib/data";

export interface ReaderProps {
  manga: Manga;
  chapter: number;
  arc: string;
  saga: string;
  unitTitle?: string;
  type: "color" | "partial" | "bw";
  pages: PageMeta[];
  prev: number | null;
  next: number | null;
  total: number;
  totalUnits: number;
  /** Every available unit number, ascending — powers the chapter picker. */
  units: number[];
  /** Manifest type keyed by unit number, for honest picker/end-card labels. */
  unitTypes: Record<number, ChapterType>;
  /** Unit titles keyed by number (volume series only). */
  unitTitles?: Record<number, string>;
}

export type ReaderMode = "strip" | "paged";
export type PagedFit = "height" | "width";
