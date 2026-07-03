"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { pageUrl, unitLabel } from "@/lib/site";
import type { Manga } from "@/lib/manga";
import type { PageMeta } from "@/lib/data";
import type { PagedFit } from "./types";

interface Props {
  manga: Manga;
  chapter: number;
  pages: PageMeta[];
  /** 1-based; pages.length + 1 is the virtual end slide. */
  page: number;
  fit: PagedFit;
  onPrev: () => void;
  onNext: () => void;
  onTap: () => void;
  endCard: ReactNode;
}

const WHEEL_COOLDOWN = 420; // ms between wheel-driven page turns

/** Single-page view: tap zones (left 30% prev / right 30% next / center
 *  chrome), horizontal swipe, wheel paging, and next-page preloading. */
export default function PagedView({
  manga,
  chapter,
  pages,
  page,
  fit,
  onPrev,
  onNext,
  onTap,
  endCard,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lastWheel = useRef(0);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const isEnd = page > pages.length;
  const meta = pages[Math.min(page, pages.length) - 1];

  // Preload neighbours so page turns feel instant.
  useEffect(() => {
    for (const p of [page + 1, page + 2, page - 1]) {
      if (p < 1 || p > pages.length) continue;
      const img = new Image();
      img.src = pageUrl(manga, chapter, pages[p - 1].n);
    }
  }, [page, pages, manga, chapter]);

  // Fit-width pages can be taller than the viewport — start each at the top.
  useEffect(() => {
    rootRef.current?.scrollTo({ top: 0 });
  }, [page, fit]);

  const turn = (dir: 1 | -1) => (dir === 1 ? onNext() : onPrev());

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) < 24) return;
    const now = performance.now();
    if (now - lastWheel.current < WHEEL_COOLDOWN) return;
    const root = rootRef.current;
    if (fit === "width" && root && !isEnd) {
      // Scroll the tall page first; only page-turn at its edges.
      const atBottom = root.scrollTop + root.clientHeight >= root.scrollHeight - 4;
      const atTop = root.scrollTop <= 4;
      if (e.deltaY > 0 && !atBottom) return;
      if (e.deltaY < 0 && !atTop) return;
    }
    lastWheel.current = now;
    turn(e.deltaY > 0 ? 1 : -1);
  };

  const handleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a,button,input")) return;
    const x = e.clientX / window.innerWidth;
    if (x < 0.3) onPrev();
    else if (x > 0.7) onNext();
    else onTap();
  };

  return (
    <div
      ref={rootRef}
      className={`absolute inset-0 select-none ${
        fit === "width" && !isEnd
          ? "overflow-y-auto overscroll-y-contain"
          : "flex items-center justify-center overflow-hidden"
      }`}
      onClick={handleClick}
      onWheel={handleWheel}
      onTouchStart={(e) => {
        touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start) return;
        const dx = e.changedTouches[0].clientX - start.x;
        const dy = e.changedTouches[0].clientY - start.y;
        if (Math.abs(dx) > 64 && Math.abs(dx) > Math.abs(dy) * 1.5) turn(dx < 0 ? 1 : -1);
      }}
    >
      {isEnd ? (
        <div className="w-full max-w-md px-6">{endCard}</div>
      ) : fit === "height" ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={page}
          src={pageUrl(manga, chapter, meta.n)}
          alt={`${manga.title} color ${unitLabel(manga).toLowerCase()} ${chapter} page ${meta.n}`}
          width={meta.w}
          height={meta.h}
          decoding="async"
          className="h-full w-auto max-w-full bg-ink-2 object-contain"
          draggable={false}
        />
      ) : (
        <div className="mx-auto w-full" style={{ maxWidth: 1080 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={page}
            src={pageUrl(manga, chapter, meta.n)}
            alt={`${manga.title} color ${unitLabel(manga).toLowerCase()} ${chapter} page ${meta.n}`}
            width={meta.w}
            height={meta.h}
            decoding="async"
            className="h-auto w-full bg-ink-2"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
