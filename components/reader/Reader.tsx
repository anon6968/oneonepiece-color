"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { listPath, pageUrl, readPath, unitAbbrev, unitLabel } from "@/lib/site";
import type { PagedFit, ReaderMode, ReaderProps } from "./types";
import { loadPref, loadProgress, savePref, saveProgress } from "./prefs";
import StripView, { type StripHandle } from "./StripView";
import PagedView from "./PagedView";
import ChapterMenu from "./ChapterMenu";
import SettingsMenu from "./SettingsMenu";
import EndCard from "./EndCard";

const WIDTHS = [480, 560, 640, 720, 820, 940, 1080, 1240, 1440];
const MODE_KEY = "cm_mode";
const FIT_KEY = "cm_fit";
const CHROME_HIDE_MS = 3200;

type Menu = "none" | "chapters" | "settings";

function barBtn(disabled?: boolean) {
  return `flex items-center justify-center rounded-lg bg-panel/80 text-mute transition hover:bg-panel-2 hover:text-fg disabled:pointer-events-none disabled:opacity-30 min-h-[44px] min-w-[44px] ${
    disabled ? "" : "active:scale-95"
  }`;
}

export default function Reader(props: ReaderProps) {
  const { manga, chapter, arc, saga, unitTitle, type, pages, prev, next, total, totalUnits } =
    props;
  const router = useRouter();

  const [mode, setMode] = useState<ReaderMode>("strip");
  const [wIdx, setWIdx] = useState(4);
  const [fit, setFit] = useState<PagedFit>("height");
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState(0);
  const [chrome, setChrome] = useState(true);
  const [menu, setMenu] = useState<Menu>("none");
  const [resumeAt, setResumeAt] = useState<number | null>(null);
  const [canFs, setCanFs] = useState(false);
  const [isFs, setIsFs] = useState(false);
  const [chromePing, setChromePing] = useState(0);

  const shellRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<StripHandle>(null);
  const pageRef = useRef(1);
  const menuRef = useRef<Menu>("none");
  const restoreScroll = useRef(false);
  // A deeper bookmark for this chapter survives until the reader moves —
  // otherwise remounting on page 1 would clobber it and kill the resume pill.
  const holdBookmark = useRef(false);

  pageRef.current = page;
  menuRef.current = menu;

  const widthKey = `cm_width_${manga.slug}`;
  const abbrev = unitAbbrev(manga);
  const unit = unitLabel(manga);
  const shownPage = Math.min(page, pages.length);
  const subtitle =
    unitTitle ?? (arc === saga ? arc : arc && saga ? `${arc} · ${saga}` : arc || saga);

  /* ------------------------------ lifecycle ------------------------------ */

  // Immersive: hide site chrome + lock body scroll behind the fixed shell.
  useEffect(() => {
    document.documentElement.classList.add("reader-mode");
    return () => document.documentElement.classList.remove("reader-mode");
  }, []);

  // Restore preferences + offer resume.
  useEffect(() => {
    const w = Number(loadPref(widthKey));
    if (Number.isInteger(w) && w >= 0 && w < WIDTHS.length) setWIdx(w);
    const m = loadPref(MODE_KEY);
    if (m === "strip" || m === "paged") {
      setMode(m);
      if (m === "strip") restoreScroll.current = false;
    }
    const f = loadPref(FIT_KEY);
    if (f === "height" || f === "width") setFit(f);
    const pr = loadProgress(manga.slug);
    if (pr && pr.n === chapter && pr.page > 1 && pr.page < pages.length) {
      setResumeAt(pr.page);
      holdBookmark.current = true;
    }
    setCanFs(!!document.fullscreenEnabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapter, manga.slug, widthKey]);

  // Auto-dismiss the resume pill.
  useEffect(() => {
    if (resumeAt === null) return;
    const t = setTimeout(() => setResumeAt(null), 9000);
    return () => clearTimeout(t);
  }, [resumeAt]);

  // Persist reading position.
  useEffect(() => {
    if (holdBookmark.current) {
      if (shownPage <= 1) return;
      holdBookmark.current = false;
    }
    saveProgress(manga.slug, { n: chapter, page: shownPage, ts: Date.now() });
  }, [manga.slug, chapter, shownPage]);

  // Prefetch the next unit's first page near the end of this one.
  useEffect(() => {
    if (!next || pages.length - shownPage > 2) return;
    const img = new Image();
    img.src = pageUrl(manga, next, 1);
  }, [next, shownPage, pages.length, manga]);

  // Paged mode: chrome hides itself after a quiet moment.
  useEffect(() => {
    if (mode !== "paged" || !chrome || menu !== "none") return;
    const t = setTimeout(() => setChrome(false), CHROME_HIDE_MS);
    return () => clearTimeout(t);
  }, [mode, chrome, menu, page, chromePing]);

  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  // Returning to strip mode: land on the page you were reading.
  useEffect(() => {
    if (mode !== "strip" || !restoreScroll.current) return;
    restoreScroll.current = false;
    requestAnimationFrame(() => stripRef.current?.scrollToPage(pageRef.current, false));
  }, [mode]);

  /* ------------------------------- actions ------------------------------- */

  const jumpToPage = useCallback(
    (p: number, smooth = true) => {
      const max = mode === "paged" ? pages.length + 1 : pages.length;
      const target = Math.max(1, Math.min(max, p));
      setPage(target);
      if (mode === "strip") stripRef.current?.scrollToPage(Math.min(target, pages.length), smooth);
    },
    [mode, pages.length],
  );

  const nextPage = useCallback(() => jumpToPage(pageRef.current + 1), [jumpToPage]);
  const prevPage = useCallback(() => jumpToPage(pageRef.current - 1), [jumpToPage]);

  const goPrevUnit = useCallback(
    () => prev && router.push(readPath(manga, prev)),
    [prev, router, manga],
  );
  const goNextUnit = useCallback(
    () => next && router.push(readPath(manga, next)),
    [next, router, manga],
  );

  const zoomIn = useCallback(() => setWIdx((v) => Math.min(WIDTHS.length - 1, v + 1)), []);
  const zoomOut = useCallback(() => setWIdx((v) => Math.max(0, v - 1)), []);
  useEffect(() => {
    savePref(widthKey, String(wIdx));
  }, [widthKey, wIdx]);

  const switchMode = useCallback((m: ReaderMode) => {
    savePref(MODE_KEY, m);
    if (m === "strip") restoreScroll.current = true;
    setMode(m);
    setMenu("none");
    setChrome(true);
  }, []);

  const switchFit = useCallback((f: PagedFit) => {
    savePref(FIT_KEY, f);
    setFit(f);
  }, []);

  const toggleFs = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else shellRef.current?.requestFullscreen().catch(() => {});
  }, []);

  const handleTap = useCallback(() => {
    if (menuRef.current !== "none") setMenu("none");
    else setChrome((v) => !v);
  }, []);

  const handleDir = useCallback((d: "up" | "down") => {
    if (menuRef.current !== "none") return;
    setChrome(d === "up");
  }, []);

  const backToTop = useCallback(() => {
    setPage(1);
    stripRef.current?.scrollToPage(1, true);
  }, []);

  /* ------------------------------ keyboard ------------------------------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement) return;
      switch (e.key) {
        case "Escape":
          if (menuRef.current !== "none") setMenu("none");
          else setChrome(true);
          break;
        case "ArrowRight":
        case "d":
          nextPage();
          break;
        case "ArrowLeft":
        case "a":
          prevPage();
          break;
        case "ArrowDown":
        case "j":
          nextPage();
          e.preventDefault();
          break;
        case "ArrowUp":
        case "k":
          prevPage();
          e.preventDefault();
          break;
        case " ":
          if (e.shiftKey) prevPage();
          else nextPage();
          e.preventDefault();
          break;
        case "]":
          goNextUnit();
          break;
        case "[":
          goPrevUnit();
          break;
        case "+":
        case "=":
          zoomIn();
          break;
        case "-":
          zoomOut();
          break;
        case "f":
          toggleFs();
          break;
        case "m":
          switchMode(mode === "strip" ? "paged" : "strip");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextPage, prevPage, goNextUnit, goPrevUnit, zoomIn, zoomOut, toggleFs, switchMode, mode]);

  /* -------------------------------- render ------------------------------- */

  const endCard = (
    <EndCard manga={manga} chapter={chapter} next={next} total={total} totalUnits={totalUnits} />
  );

  const stripTail = (
    <div className="mx-auto max-w-md px-4 pb-28 pt-10">
      {endCard}
      <p className="mt-5 text-center text-xs text-mute">
        {unit} {chapter} of {total}
      </p>
    </div>
  );

  const pinChrome = () => setChromePing((v) => v + 1);

  return (
    <div ref={shellRef} className="reader-shell fixed inset-0 z-30 bg-ink">
      {mode === "strip" ? (
        <StripView
          ref={stripRef}
          manga={manga}
          chapter={chapter}
          pages={pages}
          maxWidth={WIDTHS[wIdx]}
          onPage={setPage}
          onProgress={setProgress}
          onDir={handleDir}
          onTap={handleTap}
          tail={stripTail}
        />
      ) : (
        <PagedView
          manga={manga}
          chapter={chapter}
          pages={pages}
          page={page}
          fit={fit}
          onPrev={prevPage}
          onNext={nextPage}
          onTap={handleTap}
          endCard={endCard}
        />
      )}

      {/* Reading progress (strip) */}
      {mode === "strip" && (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-0.5">
          <div className="h-full bg-brand/90" style={{ width: `${progress}%` }} />
        </div>
      )}

      {/* Top bar */}
      <div
        className={`absolute inset-x-0 top-0 z-40 transition-transform duration-200 ${
          chrome ? "translate-y-0" : "-translate-y-full"
        }`}
        onPointerEnter={pinChrome}
      >
        <div className="border-b border-line/60 bg-ink/85 pt-[env(safe-area-inset-top)] backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center gap-2 px-2 py-2 sm:px-3">
            <Link
              href={listPath(manga)}
              className={`${barBtn()} h-9 w-9 shrink-0 text-base`}
              aria-label={`All ${manga.title} ${unit.toLowerCase()}s`}
            >
              ←
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-bold leading-tight">
                  {manga.title} · {abbrev} {chapter}
                </span>
                {type === "partial" && (
                  <span className="shrink-0 rounded bg-gold/90 px-1 py-0.5 text-[9px] font-bold text-ink">
                    PARTIAL
                  </span>
                )}
              </div>
              {subtitle && <div className="truncate text-[11px] text-mute">{subtitle}</div>}
            </div>
            <span className="shrink-0 text-xs tabular-nums text-mute">
              {shownPage} / {pages.length}
            </span>
            {canFs && (
              <button
                type="button"
                onClick={toggleFs}
                className={`${barBtn()} h-9 w-9 shrink-0 text-sm`}
                aria-label={isFs ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFs ? "⤡" : "⤢"}
              </button>
            )}
            <button
              type="button"
              onClick={() => setMenu(menu === "settings" ? "none" : "settings")}
              className={`${barBtn()} h-9 w-9 shrink-0 text-sm`}
              aria-label="Reader settings"
            >
              ⚙
            </button>
          </div>
        </div>
      </div>

      {/* Back to top — appears once you've scrolled into a long strip. */}
      {mode === "strip" && chrome && progress > 6 && (
        <button
          type="button"
          onClick={backToTop}
          className="absolute bottom-28 right-3 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel/90 text-lg text-fg shadow-xl backdrop-blur transition hover:bg-panel-2 active:scale-95"
          aria-label="Back to top"
        >
          ↑
        </button>
      )}

      {/* Resume pill */}
      {resumeAt !== null && (
        <div className="absolute inset-x-0 bottom-28 z-40 flex justify-center px-4">
          <button
            type="button"
            onClick={() => {
              jumpToPage(resumeAt, false);
              setResumeAt(null);
            }}
            className="rounded-full border border-line bg-panel/95 px-4 py-2 text-xs font-semibold text-fg shadow-xl backdrop-blur transition hover:bg-panel-2 active:scale-95"
          >
            Resume page {resumeAt} →
          </button>
        </div>
      )}

      {/* Bottom bar */}
      <div
        className={`absolute inset-x-0 bottom-0 z-40 transition-transform duration-200 ${
          chrome ? "translate-y-0" : "translate-y-full"
        }`}
        onPointerEnter={pinChrome}
      >
        <div className="border-t border-line/60 bg-ink/85 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl flex-col gap-1.5 px-3 pt-2">
            <input
              type="range"
              min={1}
              max={pages.length}
              value={shownPage}
              onChange={(e) => jumpToPage(Number(e.target.value), false)}
              className="reader-scrub w-full"
              style={{ "--fill": `${((shownPage - 1) / Math.max(1, pages.length - 1)) * 100}%` } as React.CSSProperties}
              aria-label="Page"
            />
            <div className="flex items-center gap-1.5 pb-1">
              <button
                type="button"
                onClick={goPrevUnit}
                disabled={!prev}
                className={`${barBtn(!prev)} h-10 flex-1 gap-1 text-xs`}
                aria-label={prev ? `Previous ${unit.toLowerCase()} (${prev})` : undefined}
              >
                ‹‹ {prev ? `${abbrev} ${prev}` : "—"}
              </button>
              <button
                type="button"
                onClick={() => setMenu(menu === "chapters" ? "none" : "chapters")}
                className={`${barBtn()} h-10 flex-[1.4] gap-1 text-xs font-semibold text-fg`}
                aria-label={`All ${unit.toLowerCase()}s`}
              >
                {abbrev} {chapter} <span className="text-mute">/ {total}</span> ▾
              </button>
              <button
                type="button"
                onClick={goNextUnit}
                disabled={!next}
                className={`${barBtn(!next)} h-10 flex-1 gap-1 text-xs font-bold text-brand-2`}
                aria-label={next ? `Next ${unit.toLowerCase()} (${next})` : undefined}
              >
                {next ? `${abbrev} ${next}` : "—"} ››
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlays */}
      {menu === "chapters" && (
        <ChapterMenu
          manga={manga}
          units={props.units}
          unitTitles={props.unitTitles}
          current={chapter}
          onClose={() => setMenu("none")}
        />
      )}
      {menu === "settings" && (
        <SettingsMenu
          mode={mode}
          onMode={switchMode}
          fit={fit}
          onFit={switchFit}
          widthPx={WIDTHS[wIdx]}
          canWiden={wIdx < WIDTHS.length - 1}
          canNarrow={wIdx > 0}
          onWiden={zoomIn}
          onNarrow={zoomOut}
          onClose={() => setMenu("none")}
        />
      )}
    </div>
  );
}
