"use client";

import { useCallback, useEffect, useState } from "react";
import AnimatedLogo, { type LogoMotion } from "@/components/AnimatedLogo";

const VARIANTS: { motion: LogoMotion; name: string; blurb: string }[] = [
  { motion: "calm", name: "Calm Seas", blurb: "Colorize-in on load, then just a soft breeze in the rigging. The wordmark sits dead-still — reads as a still logo that quietly breathes." },
  { motion: "wind", name: "Fresh Wind", blurb: "Colorize-in, then brisker flags and pennants and the first sparkle on the sea. Energetic, hull and wordmark rock-steady." },
  { motion: "rock", name: "Full Idle", blurb: "The hero default. Colorize-in, then flags flutter, the sea shimmers and the whole logo breathes as one — alive but never tilting." },
  { motion: "storm", name: "Storm", blurb: "Colorize-in, then snapping flags and a restless, faster shimmer. The most energetic idle; the wordmark still never moves." },
];

/**
 * Interactive preview for the logo animation. Each card colorizes in on mount;
 * bumping its `key` remounts it and replays the reveal. Auto-loops by default so
 * the motion is visible the instant the lab opens; click any card to replay just
 * that one, or use the controls to replay all / stop the loop.
 */
export default function LogoShowcase() {
  const [keys, setKeys] = useState([0, 0, 0, 0]);
  const [loop, setLoop] = useState(true);

  const replayAll = useCallback(() => setKeys((k) => k.map((n) => n + 1)), []);
  const replayOne = (i: number) => setKeys((k) => k.map((n, j) => (j === i ? n + 1 : n)));

  useEffect(() => {
    if (!loop) return;
    const id = setInterval(replayAll, 4600);
    return () => clearInterval(id);
  }, [loop, replayAll]);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={replayAll}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          ↻ Replay colorize
        </button>
        <label className="flex cursor-pointer select-none items-center gap-2 rounded-lg bg-panel px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
            className="accent-brand"
          />
          Loop the reveal
        </label>
        <span className="text-xs text-mute">Tip: click any logo to replay just that one.</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VARIANTS.map((v, i) => (
          <figure
            key={v.motion}
            onClick={() => replayOne(i)}
            className="group cursor-pointer rounded-2xl bg-panel/60 p-4 ring-1 ring-white/5 transition hover:bg-panel"
          >
            <div className="overflow-hidden rounded-xl bg-black">
              <AnimatedLogo
                key={keys[i]}
                motion={v.motion}
                priority
                className="w-full transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <figcaption className="mt-4">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-brand/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-brand-2">
                  {v.motion}
                </span>
                <h2 className="text-base font-bold">{v.name}</h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-mute">{v.blurb}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
