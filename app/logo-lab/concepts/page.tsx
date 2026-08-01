import type { Metadata } from "next";
import Link from "next/link";
import LogoConcepts from "@/components/LogoConcepts";

export const metadata: Metadata = {
  title: "Logo Animation Concepts",
  robots: { index: false, follow: false },
};

export default function LogoConceptsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="mb-10">
        <Link href="/logo-lab" className="text-xs text-mute hover:text-fg">
          ← Logo Lab
        </Link>
        <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          Logo Animation Concepts
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-mute">
          Nine genuinely different reveal animations for the logo — from the colourize develop to a
          light sheen, a rise from the sea, a print-registration snap and more. They all loop so you
          can watch them side by side. Tell me the number you want and I&apos;ll make it the hero (and
          retire the rest).
        </p>
      </header>

      <LogoConcepts />
    </div>
  );
}
