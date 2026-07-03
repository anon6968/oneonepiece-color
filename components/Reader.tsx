"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { listPath, pageUrl, readPath, unitAbbrev, unitLabel } from "@/lib/site";
import type { Manga } from "@/lib/manga";
import type { PageMeta } from "@/lib/data";

interface Props {
  manga: Manga;
  chapter: number;
  arc: string;
  saga: string;
  unitTitle?: string;
  type: "color" | "partial";
  pages: PageMeta[];
  prev: number | null;
  next: number | null;
  total: number;
  totalUnits: number;
}

const WIDTHS = [480, 560, 640, 720, 820, 940, 1080, 1240, 1440];

export default function Reader({
  manga,
  chapter,
  arc,
  saga,
  unitTitle,
  type,
  pages,
  prev,
  next,
  total,
  totalUnits,
}: Props) {
  const router = useRouter();
  const [wIdx, setWIdx] = useState(4);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [cur, setCur] = useState(1);
  const [shared, setShared] = useState(false);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const storeKey = `cm_width_${manga.slug}`;
  const abbrev = unitAbbrev(manga);

  // restore preferred width
  useEffect(() => {
    const s = Number(localStorage.getItem(storeKey));
    if (Number.isInteger(s) && s >= 0 && s < WIDTHS.length) setWIdx(s);
  }, [storeKey]);
  useEffect(() => {
    localStorage.setItem(storeKey, String(wIdx));
  }, [storeKey, wIdx]);

  // scroll progress + current page tracking
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? Math.min(100, (h.scrollTop / max) * 100) : 0);
      const mid = window.scrollY + window.innerHeight / 2;
      let c = 1;
      for (let i = 0; i < pageRefs.current.length; i++) {
        const el = pageRefs.current[i];
        if (el && el.offsetTop <= mid) c = i + 1;
      }
      setCur(c);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pages.length]);

  const goPrev = useCallback(
    () => prev && router.push(readPath(manga, prev)),
    [prev, router, manga],
  );
  const goNext = useCallback(
    () => next && router.push(readPath(manga, next)),
    [next, router, manga],
  );

  const share = useCallback(async () => {
    const url = window.location.href;
    const title = `${manga.title} ${unitLabel(manga)} ${chapter} in full color`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      /* dismissed */
    }
    try {
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 1600);
    } catch {
      /* unsupported */
    }
  }, [manga, chapter]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox !== null) {
        if (e.key === "Escape") setLightbox(null);
        if (e.key === "ArrowRight" || e.key === "ArrowDown")
          setLightbox((v) => (v === null ? v : Math.min(pages.length - 1, v + 1)));
        if (e.key === "ArrowLeft" || e.key === "ArrowUp")
          setLightbox((v) => (v === null ? v : Math.max(0, v - 1)));
        return;
      }
      if (e.key === "[") goPrev();
      if (e.key === "]") goNext();
      if (e.key === "+" || e.key === "=") setWIdx((v) => Math.min(WIDTHS.length - 1, v + 1));
      if (e.key === "-") setWIdx((v) => Math.max(0, v - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, pages.length, goPrev, goNext]);

  const maxW = WIDTHS[wIdx];

  return (
    <div className="pb-10">
      {/* progress */}
      <div className="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
        <div className="h-full bg-brand transition-[width]" style={{ width: `${progress}%` }} />
      </div>

      {/* toolbar */}
      <div className="sticky top-14 z-30 bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2">
          <Link
            href={listPath(manga)}
            className="rounded-lg bg-panel px-2.5 py-1.5 text-xs text-mute hover:text-fg"
            aria-label={`All ${manga.title} ${unitLabel(manga).toLowerCase()}s`}
          >
            ☰
          </Link>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold">
              {manga.title} · {abbrev} {chapter}
              {type === "partial" && (
                <span className="ml-2 rounded bg-gold/90 px-1 py-0.5 text-[10px] font-bold text-ink">
                  PARTIAL
                </span>
              )}
            </div>
            <div className="truncate text-[11px] text-mute">
              {unitTitle
                ? unitTitle
                : arc === saga
                  ? arc
                  : `${arc} · ${saga}`}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1">
            <span className="mr-1 text-[11px] tabular-nums text-mute sm:text-xs">
              {cur}/{pages.length}
            </span>
            <button
              onClick={share}
              className="rounded-lg bg-panel px-2.5 py-1.5 text-xs text-mute hover:text-fg"
              aria-label={`Share this ${unitLabel(manga).toLowerCase()}`}
              title="Share"
            >
              {shared ? "✓ Copied" : "Share"}
            </button>
            <div className="hidden items-center rounded-lg bg-panel sm:flex">
              <button
                onClick={() => setWIdx((v) => Math.max(0, v - 1))}
                className="px-2.5 py-1.5 text-sm text-mute hover:text-fg disabled:opacity-30"
                disabled={wIdx === 0}
                aria-label="Zoom out page width"
              >
                −
              </button>
              <span className="px-1 text-[10px] text-mute">width</span>
              <button
                onClick={() => setWIdx((v) => Math.min(WIDTHS.length - 1, v + 1))}
                className="px-2.5 py-1.5 text-sm text-mute hover:text-fg disabled:opacity-30"
                disabled={wIdx === WIDTHS.length - 1}
                aria-label="Zoom in page width"
              >
                +
              </button>
            </div>
            <button
              onClick={goPrev}
              disabled={!prev}
              className="rounded-lg bg-panel px-2.5 py-1.5 text-xs hover:bg-panel-2 disabled:opacity-30"
              aria-label={`Previous ${unitLabel(manga).toLowerCase()}`}
            >
              ‹<span className="hidden sm:inline"> Prev</span>
            </button>
            <button
              onClick={goNext}
              disabled={!next}
              className="rounded-lg bg-panel px-2.5 py-1.5 text-xs hover:bg-panel-2 disabled:opacity-30"
              aria-label={`Next ${unitLabel(manga).toLowerCase()}`}
            >
              <span className="hidden sm:inline">Next </span>›
            </button>
          </div>
        </div>
      </div>

      {/* pages */}
      <div className="mx-auto px-2 pt-4" style={{ maxWidth: maxW }}>
        {pages.map((p, i) => (
          <div
            key={p.n}
            ref={(el) => {
              pageRefs.current[i] = el;
            }}
            className="mb-1.5"
          >
            <button
              onClick={() => setLightbox(i)}
              className="block w-full cursor-zoom-in"
              aria-label={`Zoom page ${p.n}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pageUrl(manga, chapter, p.n)}
                alt={`${manga.title} color ${unitLabel(manga)} ${chapter} page ${p.n}`}
                width={p.w}
                height={p.h}
                loading={i < 2 ? "eager" : "lazy"}
                decoding="async"
                className="h-auto w-full rounded-sm bg-ink-2"
                style={{ aspectRatio: `${p.w} / ${p.h}` }}
              />
            </button>
          </div>
        ))}
      </div>

      {/* end nav */}
      <div className="mx-auto mt-8 flex max-w-md items-center justify-between gap-3 px-4">
        <button
          onClick={goPrev}
          disabled={!prev}
          className="flex-1 rounded-xl bg-panel px-4 py-3 text-sm font-semibold hover:bg-panel-2 disabled:opacity-30"
        >
          ‹ Previous
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="rounded-xl bg-panel px-4 py-3 text-sm text-mute hover:text-fg"
          aria-label="Back to top"
        >
          ↑
        </button>
        <button
          onClick={goNext}
          disabled={!next}
          className="flex-1 rounded-xl bg-gradient-to-r from-brand to-brand-2 px-4 py-3 text-sm font-bold text-white disabled:opacity-40"
        >
          Next ›
        </button>
      </div>
      <p className="mt-6 text-center text-xs text-mute">
        {unitLabel(manga)} {chapter} of {total} · {totalUnits} in full color ·{" "}
        <Link href={listPath(manga)} className="text-brand hover:underline">
          all {manga.title} {unitLabel(manga).toLowerCase()}s
        </Link>
      </p>

      {/* lightbox with pinch/wheel zoom + pan */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[60] bg-black/95">
          <TransformWrapper
            key={lightbox}
            initialScale={1}
            minScale={1}
            maxScale={6}
            doubleClick={{ mode: "toggle", step: 2.4 }}
            wheel={{ step: 0.15 }}
            centerOnInit
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-3">
                  <span className="pointer-events-auto rounded-lg bg-panel/80 px-3 py-1.5 text-xs">
                    Page {lightbox + 1} / {pages.length}
                  </span>
                  <div className="pointer-events-auto flex items-center gap-1.5">
                    <button onClick={() => zoomOut()} className="rounded-lg bg-panel/80 px-3 py-1.5 text-sm" aria-label="Zoom out">−</button>
                    <button onClick={() => resetTransform()} className="rounded-lg bg-panel/80 px-3 py-1.5 text-xs" aria-label="Reset zoom">Fit</button>
                    <button onClick={() => zoomIn()} className="rounded-lg bg-panel/80 px-3 py-1.5 text-sm" aria-label="Zoom in">+</button>
                    <button onClick={() => setLightbox(null)} className="rounded-lg bg-brand px-3 py-1.5 text-sm font-bold text-white" aria-label="Close">✕</button>
                  </div>
                </div>
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{ width: "100%", height: "100%" }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pageUrl(manga, chapter, pages[lightbox].n)}
                      alt={`${manga.title} color ${unitLabel(manga)} ${chapter} page ${pages[lightbox].n} (zoom)`}
                      className="max-h-screen w-auto max-w-full select-none object-contain"
                      draggable={false}
                    />
                  </div>
                </TransformComponent>

                {lightbox > 0 && (
                  <button
                    onClick={() => setLightbox((v) => (v === null ? v : v - 1))}
                    className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-panel/70 px-3 py-4 text-lg hover:bg-panel"
                    aria-label="Previous page"
                  >
                    ‹
                  </button>
                )}
                {lightbox < pages.length - 1 && (
                  <button
                    onClick={() => setLightbox((v) => (v === null ? v : v + 1))}
                    className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-panel/70 px-3 py-4 text-lg hover:bg-panel"
                    aria-label="Next page"
                  >
                    ›
                  </button>
                )}
              </>
            )}
          </TransformWrapper>
        </div>
      )}
    </div>
  );
}
