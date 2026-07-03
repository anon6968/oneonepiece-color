import type { Metadata } from "next";
import Image from "next/image";
import AnimatedLogo, { type LogoMotion } from "@/components/AnimatedLogo";

export const metadata: Metadata = {
  title: "Logo Lab",
  robots: { index: false, follow: false },
};

const VARIANTS: { motion: LogoMotion; name: string; blurb: string }[] = [
  { motion: "calm", name: "Calm Seas", blurb: "Gentle breeze in the flags, a slow ocean swell. Subtle — reads as a still logo that quietly breathes." },
  { motion: "wind", name: "Fresh Wind", blurb: "Flags snap and the pennants ripple faster; the sea is livelier. Energetic but the hull stays put." },
  { motion: "rock", name: "Riding the Swell", blurb: "The whole ship rocks on the waves while the flag waves and the sea rises and falls. The full sailing feel." },
  { motion: "storm", name: "Storm", blurb: "Dramatic — hard roll, flapping flag, heavy sea. Great for a splashy hero, maybe too much for a header." },
];

export default function LogoLab() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Logo Lab</h1>
        <p className="mt-2 max-w-2xl text-sm text-mute">
          The core logo, cut into layers and animated four different ways — flags waving, sea rising
          and falling. Pick the one you want and I&apos;ll wire it into the header and hero. Hover any
          card to see it larger.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {VARIANTS.map((v) => (
          <figure
            key={v.motion}
            className="group rounded-2xl bg-panel/60 p-4 ring-1 ring-white/5 transition hover:bg-panel"
          >
            <div className="overflow-hidden rounded-xl bg-black">
              <AnimatedLogo
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

      <section className="mt-14">
        <h2 className="mb-4 text-lg font-bold">Static reference</h2>
        <div className="w-full max-w-xs overflow-hidden rounded-xl bg-black">
          <Image
            src="/logo-master.png"
            alt="Original logo"
            width={1024}
            height={1024}
            unoptimized
            className="h-auto w-full"
          />
        </div>
      </section>
    </div>
  );
}
