"use client";

import { useEffect, useState } from "react";

/** Minimal, non-forceful share affordance. Uses the native share sheet on
 *  mobile (navigator.share); on desktop it opens a small popover with copy-link
 *  + a few platform links. No nags, no auto-popups — just an available button. */
export default function ShareButton({ title }: { title?: string }) {
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState(title ?? "");
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
    if (!title) setLabel(document.title);
  }, [title]);

  async function onShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: label, url });
        return;
      } catch {
        /* user cancelled — fall through to popover */
      }
    }
    setOpen((o) => !o);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  const u = encodeURIComponent(url);
  const t = encodeURIComponent(label);
  const links = [
    ["Copy link", "", copy],
    ["X", `https://twitter.com/intent/tweet?url=${u}&text=${t}`],
    ["Reddit", `https://www.reddit.com/submit?url=${u}&title=${t}`],
    ["WhatsApp", `https://wa.me/?text=${t}%20${u}`],
    ["Facebook", `https://www.facebook.com/sharer/sharer.php?u=${u}`],
  ] as const;

  return (
    <div className="relative inline-block">
      <button
        onClick={onShare}
        aria-label="Share"
        className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-panel/60 px-3 py-1.5 text-xs font-semibold text-mute transition hover:text-fg hover:border-brand/40"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
        </svg>
        Share
      </button>

      {open && (
        <div
          className="absolute right-0 z-20 mt-2 flex w-40 flex-col overflow-hidden rounded-xl border border-line bg-panel shadow-xl shadow-black/50"
          onMouseLeave={() => setOpen(false)}
        >
          {links.map(([name, href, action]) =>
            action ? (
              <button
                key={name}
                onClick={action}
                className="px-4 py-2.5 text-left text-sm text-fg hover:bg-panel-2"
              >
                {copied ? "Copied!" : name}
              </button>
            ) : (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 text-sm text-fg hover:bg-panel-2"
              >
                {name}
              </a>
            ),
          )}
        </div>
      )}
    </div>
  );
}
