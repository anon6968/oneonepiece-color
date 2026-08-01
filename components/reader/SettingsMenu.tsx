"use client";

import type { PagedFit, ReaderMode } from "./types";

interface Props {
  mode: ReaderMode;
  onMode: (m: ReaderMode) => void;
  fit: PagedFit;
  onFit: (f: PagedFit) => void;
  widthPx: number;
  canWiden: boolean;
  canNarrow: boolean;
  onWiden: () => void;
  onNarrow: () => void;
  onClose: () => void;
}

function Seg({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition ${
        active ? "bg-brand text-white" : "bg-panel-2/60 text-mute hover:bg-panel-2 hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

export default function SettingsMenu({
  mode,
  onMode,
  fit,
  onFit,
  widthPx,
  canWiden,
  canNarrow,
  onWiden,
  onNarrow,
  onClose,
}: Props) {
  return (
    <>
      <div className="absolute inset-0 z-40 bg-ink/70" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-label="Reader settings"
        className="absolute inset-x-0 bottom-0 z-50 rounded-t-2xl border-t border-line bg-panel p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl sm:inset-x-auto sm:bottom-auto sm:right-4 sm:top-16 sm:w-72 sm:rounded-2xl sm:border"
      >
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-mute">
          Reading mode
        </p>
        <div className="flex gap-1.5">
          <Seg active={mode === "strip"} onClick={() => onMode("strip")}>
            Long strip
          </Seg>
          <Seg active={mode === "paged"} onClick={() => onMode("paged")}>
            Single page
          </Seg>
        </div>

        {mode === "strip" ? (
          <>
            <p className="mb-2 mt-4 hidden text-[10px] font-semibold uppercase tracking-widest text-mute sm:block">
              Page width
            </p>
            <div className="hidden items-center gap-2 sm:flex">
              <button
                type="button"
                onClick={onNarrow}
                disabled={!canNarrow}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-panel-2/60 text-lg text-mute transition hover:bg-panel-2 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
                aria-label="Narrower"
              >
                −
              </button>
              <span className="flex-1 text-center text-xs tabular-nums text-mute">{widthPx} px</span>
              <button
                type="button"
                onClick={onWiden}
                disabled={!canWiden}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-panel-2/60 text-lg text-mute transition hover:bg-panel-2 hover:text-fg disabled:pointer-events-none disabled:opacity-30"
                aria-label="Wider"
              >
                +
              </button>
            </div>
            <p className="mt-4 text-xs text-mute sm:hidden">Pinch to zoom in on any page.</p>
          </>
        ) : (
          <>
            <p className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-widest text-mute">
              Page fit
            </p>
            <div className="flex gap-1.5">
              <Seg active={fit === "height"} onClick={() => onFit("height")}>
                Fit height
              </Seg>
              <Seg active={fit === "width"} onClick={() => onFit("width")}>
                Fit width
              </Seg>
            </div>
          </>
        )}

        <p className="mt-4 hidden text-[11px] leading-relaxed text-mute sm:block">
          <kbd className="rounded bg-panel-2 px-1">←</kbd>{" "}
          <kbd className="rounded bg-panel-2 px-1">→</kbd> pages ·{" "}
          <kbd className="rounded bg-panel-2 px-1">[</kbd>{" "}
          <kbd className="rounded bg-panel-2 px-1">]</kbd> chapters ·{" "}
          <kbd className="rounded bg-panel-2 px-1">m</kbd> mode ·{" "}
          <kbd className="rounded bg-panel-2 px-1">f</kbd> fullscreen
        </p>
      </div>
    </>
  );
}
