"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, type ReactNode } from "react";
import { pageUrl, unitLabel } from "@/lib/site";
import type { Manga } from "@/lib/manga";
import type { PageMeta } from "@/lib/data";

export interface StripHandle {
  scrollToPage: (page: number, smooth?: boolean) => void;
}

interface Props {
  manga: Manga;
  chapter: number;
  pages: PageMeta[];
  maxWidth: number;
  onPage: (page: number) => void;
  onProgress: (pct: number) => void;
  /** Scroll direction with hysteresis — drives chrome auto-hide. */
  onDir: (dir: "up" | "down") => void;
  onTap: () => void;
  /** Rendered after the last page (end card + crawlable footer). */
  tail: ReactNode;
}

/** Vertical long-strip view. Owns the scroll container and reports the
 *  current page (viewport midpoint), progress % and scroll direction. */
const StripView = forwardRef<StripHandle, Props>(function StripView(
  { manga, chapter, pages, maxWidth, onPage, onProgress, onDir, onTap, tail },
  ref,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastTop = useRef(0);
  const ticking = useRef(false);

  useImperativeHandle(ref, () => ({
    scrollToPage(page: number, smooth = true) {
      const root = rootRef.current;
      const el = pageRefs.current[page - 1];
      if (!root || !el) return;
      root.scrollTo({ top: el.offsetTop - 6, behavior: smooth ? "smooth" : "auto" });
    },
  }));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      ticking.current = false;
      const top = root.scrollTop;
      const max = root.scrollHeight - root.clientHeight;
      const delta = top - lastTop.current;
      if (delta > 14 && top > 180) onDir("down");
      else if (delta < -14 || top < 48 || max - top < 140) onDir("up");
      lastTop.current = top;

      onProgress(max > 0 ? Math.min(100, (top / max) * 100) : 0);

      const mid = top + root.clientHeight / 2;
      let cur = 1;
      for (let i = 0; i < pageRefs.current.length; i++) {
        const el = pageRefs.current[i];
        if (el && el.offsetTop <= mid) cur = i + 1;
      }
      onPage(cur);
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(measure);
    };

    root.addEventListener("scroll", onScroll, { passive: true });
    measure();
    return () => root.removeEventListener("scroll", onScroll);
  }, [onDir, onPage, onProgress, pages.length]);

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a,button,input")) return;
        onTap();
      }}
    >
      <div className="mx-auto w-full px-0 sm:px-2" style={{ maxWidth }}>
        {pages.map((p, i) => (
          <div
            key={p.n}
            ref={(el) => {
              pageRefs.current[i] = el;
            }}
            className="mb-1"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pageUrl(manga, chapter, p.n)}
              alt={`${manga.title} color ${unitLabel(manga).toLowerCase()} ${chapter} page ${p.n}`}
              width={p.w}
              height={p.h}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              className="h-auto w-full bg-ink-2 sm:rounded-sm"
              style={{ aspectRatio: `${p.w} / ${p.h}` }}
              draggable={false}
            />
          </div>
        ))}
        {tail}
      </div>
    </div>
  );
});

export default StripView;
