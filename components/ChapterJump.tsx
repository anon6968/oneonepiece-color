"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { readPath, unitAbbrev } from "@/lib/site";
import type { Manga } from "@/lib/manga";

export default function ChapterJump({ manga, max }: { manga: Manga; max: number }) {
  const router = useRouter();
  const [v, setV] = useState("");
  const abbrev = unitAbbrev(manga).replace(".", "").toLowerCase();

  function go(e: React.FormEvent) {
    e.preventDefault();
    const n = parseInt(v, 10);
    if (!Number.isNaN(n) && n > 0) router.push(readPath(manga, n));
  }

  return (
    <form onSubmit={go} className="relative">
      <input
        inputMode="numeric"
        value={v}
        onChange={(e) => setV(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder={max ? `Go to ${abbrev}… (1–${max})` : `Go to ${abbrev}…`}
        aria-label={`Jump to ${abbrev}`}
        className="w-36 rounded-lg bg-panel px-3 py-1.5 text-sm text-fg placeholder:text-mute/70 outline-none transition focus:ring-2 focus:ring-brand/40 sm:w-44"
      />
    </form>
  );
}
