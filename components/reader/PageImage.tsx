"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  src: string;
  alt: string;
  /** Intrinsic pixel size — reserves the exact box so nothing shifts. */
  w: number;
  h: number;
  eager?: boolean;
}

/** A single long-strip page. Reserves its aspect box up front, shows a subtle
 *  shimmer while the image decodes, then fades the page in over it. The
 *  shimmer class is removed on load so the (now covered) animation stops. */
export default function PageImage({ src, alt, w, h, eager = false }: Props) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Cached images can finish before React attaches onLoad — catch that here.
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <div
      className={`overflow-hidden sm:rounded-sm ${loaded ? "" : "img-skeleton"}`}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ref}
        src={src}
        alt={alt}
        width={w}
        height={h}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`h-auto w-full transition-opacity duration-500 ease-out ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        draggable={false}
      />
    </div>
  );
}
