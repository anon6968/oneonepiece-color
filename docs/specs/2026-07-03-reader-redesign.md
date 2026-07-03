# Reader redesign — immersive, two-mode, chapter-aware

Date: 2026-07-03. Replaces the monolithic `components/Reader.tsx`.

## First principles

Reading manga = looking at pages. Everything else (nav, zoom, chapter jumps)
is occasional, so it must cost zero pixels while reading and be one tap away.
The old reader kept permanent bars on mobile and a permanent 52px rail on
desktop, had no in-chapter jumping, no paged mode, no resume, and a
"toolbar position" setting nobody asked for.

## Design

**Shell.** `fixed inset-0` on every breakpoint. Site header/footer stay hidden
via the existing `html.reader-mode` class; body scroll is locked. All chrome
is overlaid on the pages and auto-hides.

**Chrome.**
- Top bar: back-to-list, title (manga · unit N · arc/title, PARTIAL badge),
  page counter, fullscreen (where supported), settings.
- Bottom bar: page scrubber (range input), prev unit / chapter picker / next unit.
- Strip mode: scroll down hides chrome, scroll up (or reaching either end)
  shows it. Paged mode: idle timeout (~3s) hides it. Tap/click on the page
  center toggles it. Open menus pin it.

**Modes** (persisted in localStorage, `cm_mode`):
- `strip` (default, SSR output → SEO keeps all page images + alt text in HTML):
  vertical scroll, width stepper (desktop only; phones use native pinch-zoom),
  thin progress bar, end-of-chapter card after the last page.
- `paged`: one page at a time, fit-height or fit-width (`cm_fit`), tap zones
  (left 30% prev / right 30% next / center chrome), horizontal swipe, wheel
  paging (edge-triggered in fit-width), preloads the next two pages, and a
  virtual end slide with the end card.
  Page position survives mode switches.

**Chapter picker.** Overlay listing every unit: chip grid for numbered
chapters, titled rows for volume series. Opens centered on the current unit.
Requires new `units: number[]` (+ `unitTitles` for volumes) props from
`lib/unit-page.tsx`.

**End card.** "End of Chapter N" + Continue to next unit / back to all units;
"caught up" state when there is no next.

**Resume.** `cm_progress_<slug>` = `{n, page, ts}` saved as you read. If you
reopen the same unit past page 1, a dismissible pill offers "Resume page X".

**Keyboard.** ←/→ + space + j/k pages, [ ] units, +/− width (strip),
f fullscreen, m mode toggle, Esc closes menus / shows chrome.

**Preloading.** Paged: pages n±1, n+2. Both modes: first page of the next
unit once within 3 pages of the end.

## Components

```
components/reader/
  Reader.tsx        orchestrator: state, prefs, chrome, keyboard, progress
  StripView.tsx     scroll container, current-page tracking, scroll direction
  PagedView.tsx     single page, fit modes, tap zones, swipe, wheel
  ChapterMenu.tsx   unit picker overlay
  SettingsMenu.tsx  mode / width / fit
  EndCard.tsx       end-of-unit card (shared by both modes)
  prefs.ts          guarded localStorage helpers
  types.ts          shared props
```

`lib/unit-page.tsx` passes the extra `units`/`unitTitles` props; the sr-only
SEO heading/breadcrumb and JSON-LD are unchanged. `globals.css` swaps the old
reader block for scroll-lock + scrubber styling.

## Out of scope

Right-to-left paged direction, double-page spreads, server-side reading
accounts. The dropped "toolbar position" feature is intentional.
