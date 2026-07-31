"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const HOME_ICON = (
  <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12l9-8 9 8" />
    <path d="M5 10v9a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-9" />
  </svg>
);

const LIBRARY_ICON = (
  <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

/**
 * Mobile bottom bar. The site's whole identity is Color vs. black & white, so
 * that switch is the star here — a segmented toggle driving the library view
 * (the same body-scoped radios the in-page toggle uses; see globals.css), with
 * Home and Library flanking it. Series navigation lives in the library grid
 * (the cards ARE the navigation), so it doesn't need a row of tabs down here.
 *
 * Hidden inside the reader (`html.reader-mode nav[...]` in globals.css), where
 * the reader's own controls take over.
 */
export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";

  // Tapping Color/B&W always sets the view (the <label> toggles the radio
  // natively; that state lives in the persistent root layout, so it survives a
  // client navigation). On the home page we also reveal the library so the swap
  // is visible; elsewhere we route to it.
  const revealLibrary = useCallback(() => {
    if (onHome) {
      document.getElementById("library")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push("/#library");
    }
  }, [onHome, router]);

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line/60 bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden"
    >
      <div className="mx-auto flex max-w-md items-stretch gap-1.5 px-2.5 py-1.5">
        <Link
          href="/"
          aria-current={onHome ? "page" : undefined}
          className={`flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium transition active:scale-95 ${
            onHome ? "text-brand" : "text-mute"
          }`}
        >
          {HOME_ICON}
          <span>Home</span>
        </Link>

        {/* Color / B&W segmented toggle — labels for the body-scoped radios. */}
        <div
          className="cmnav-toggle flex flex-[1.7] items-center rounded-xl border border-line bg-panel/60 p-1"
          role="group"
          aria-label="Color or black and white library view"
        >
          <label
            htmlFor="lib-view-color"
            data-tab="color"
            onClick={revealLibrary}
            className="cmnav-seg flex min-h-[38px] flex-1 cursor-pointer touch-manipulation select-none items-center justify-center rounded-lg text-[11px] font-semibold text-mute transition"
          >
            Color
          </label>
          <label
            htmlFor="lib-view-bw"
            data-tab="bw"
            onClick={revealLibrary}
            className="cmnav-seg flex min-h-[38px] flex-1 cursor-pointer touch-manipulation select-none items-center justify-center rounded-lg text-[11px] font-semibold text-mute transition"
          >
            B&amp;W
          </label>
        </div>

        <Link
          href="/#library"
          className="flex min-h-[44px] flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium text-mute transition active:scale-95"
        >
          {LIBRARY_ICON}
          <span>Library</span>
        </Link>
      </div>
    </nav>
  );
}
