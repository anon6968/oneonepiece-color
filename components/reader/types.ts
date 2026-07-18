import type { Manga } from "@/lib/manga";
import type { PageMeta } from "@/lib/data";

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
  /** Unit titles keyed by number (volume series only). */
  unitTitles?: Record<number, string>;
}

export type ReaderMode = "strip" | "paged";
export type PagedFit = "height" | "width";
