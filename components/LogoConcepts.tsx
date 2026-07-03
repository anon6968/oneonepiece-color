"use client";

import { useCallback, useEffect, useState } from "react";
import s from "@/app/logo-lab/concepts.module.css";

const BASE = "/logo-anim";

const CONCEPTS: { id: string; name: string; blurb: string }[] = [
  { id: "colorize", name: "Colorize Develop", blurb: "The B&W engraving develops into full colour. The brand promise, literally. (current hero)" },
  { id: "wipe", name: "Colour Wipe", blurb: "Colour washes across the art in one clean sweep, left to right, over a grey copy." },
  { id: "rise", name: "Rise from the Sea", blurb: "The ship surfaces from behind the waves and settles into frame." },
  { id: "sheen", name: "Ink Sheen", blurb: "A single specular highlight glides across the engraving like light on metal." },
  { id: "assemble", name: "Assemble", blurb: "Waves, hull, pennants and flag build in one after another." },
  { id: "hoist", name: "Flag Hoist", blurb: "The jolly-roger runs up the mast and unfurls at the top." },
  { id: "register", name: "Print Register", blurb: "Mis-registered red/cyan colour plates slide into alignment — an old-press colourize." },
  { id: "zoom", name: "Zoom Settle", blurb: "Rushes in oversized and soft, then snaps into sharp focus." },
  { id: "ember", name: "Ember Glow", blurb: "No reveal — the red embers pulse and breathe. Pure living idle." },
];

function ConceptLogo({ concept }: { concept: string }) {
  return (
    <div
      className={`${s.fx} ${s[`fx_${concept}`]}`}
      role="img"
      aria-label="Colorized Manga logo"
    >
      {concept === "wipe" && (
        <img className={s.gray} src={`${BASE}/base.png`} alt="" decoding="async" />
      )}
      <div className={s.stage}>
        <div className={s.ship}>
          <img className={s.base} src={`${BASE}/base.png`} alt="" decoding="async" />
          <img className={s.pennants} src={`${BASE}/pennants.png`} alt="" decoding="async" />
          <img className={s.flag} src={`${BASE}/flag.png`} alt="" decoding="async" />
        </div>
        <img className={s.water} src={`${BASE}/water.png`} alt="" decoding="async" />
      </div>
      {concept === "sheen" && <div className={s.sheen} />}
    </div>
  );
}

/**
 * Concept picker for the logo reveal. Each card plays a genuinely different
 * animation. Bumping a card's key remounts it and replays its reveal; auto-loops
 * by default so every concept is in motion when the page opens, and any card can
 * be replayed on click.
 */
export default function LogoConcepts() {
  const [keys, setKeys] = useState(() => CONCEPTS.map(() => 0));
  const [loop, setLoop] = useState(true);

  const replayAll = useCallback(() => setKeys((ks) => ks.map((n) => n + 1)), []);
  const replayOne = (i: number) => setKeys((ks) => ks.map((n, j) => (j === i ? n + 1 : n)));

  useEffect(() => {
    if (!loop) return;
    const id = setInterval(replayAll, 5200);
    return () => clearInterval(id);
  }, [loop, replayAll]);

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={replayAll}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          ↻ Replay all
        </button>
        <label className="flex cursor-pointer select-none items-center gap-2 rounded-lg bg-panel px-3 py-2 text-sm">
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
            className="accent-brand"
          />
          Loop every 5s
        </label>
        <span className="text-xs text-mute">Tip: click any logo to replay just that one.</span>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CONCEPTS.map((c, i) => (
          <figure
            key={c.id}
            onClick={() => replayOne(i)}
            className="group cursor-pointer rounded-2xl bg-panel/60 p-4 ring-1 ring-white/5 transition hover:bg-panel"
          >
            <div className="overflow-hidden rounded-xl bg-black">
              <ConceptLogo key={keys[i]} concept={c.id} />
            </div>
            <figcaption className="mt-4">
              <h2 className="text-base font-bold">
                <span className="mr-2 text-mute">{i + 1}.</span>
                {c.name}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-mute">{c.blurb}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}
