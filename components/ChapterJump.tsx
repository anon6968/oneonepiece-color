"use client";

import { useState } from "react";
import { readPath, unitAbbrev } from "@/lib/site";
import type { Manga } from "@/lib/manga";
import { availableUnit, availableUnitHint } from "@/lib/unit-availability";

export default function ChapterJump({ manga, units }: { manga: Manga; units: number[] }) {
  const [v, setV] = useState("");
  const abbrev = unitAbbrev(manga).replace(".", "").toLowerCase();

  function go(e: React.FormEvent) {
    e.preventDefault();
    // Routes are statically generated (dynamicParams = false). A number inside
    // the overall range can still be absent, so require exact membership.
    const n = availableUnit(v, units);
    if (n !== null) {
      window.location.assign(readPath(manga, n));
    }
  }

  return (
    <form onSubmit={go} className="relative">
      <input
        inputMode="numeric"
        value={v}
        onChange={(e) => setV(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder={`Go to ${abbrev}…${units.length ? ` (${availableUnitHint(units)})` : ""}`}
        aria-label={`Jump to ${abbrev}`}
        className="w-36 rounded-lg bg-panel px-3 py-1.5 text-sm text-fg placeholder:text-mute/70 outline-none transition focus:ring-2 focus:ring-brand/40 sm:w-44"
      />
    </form>
  );
}
