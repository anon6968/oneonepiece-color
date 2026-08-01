import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LogoShowcase from "@/components/LogoShowcase";

export const metadata: Metadata = {
  title: "Logo Lab",
  robots: { index: false, follow: false },
};

export default function LogoLab() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="mb-10">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Logo Lab</h1>
        <p className="mt-2 max-w-2xl text-sm text-mute">
          The core logo colorizes in from black-and-white on load, then settles into one of four idle
          intensities — the flags flutter and the sea shimmers while the wordmark stays rock-steady.
          The reveal loops here so you can watch it; pick the idle you want and I&apos;ll wire it into
          the header and hero.
        </p>
        <Link
          href="/logo-lab/concepts"
          className="mt-4 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
        >
          → See 9 different animation concepts
        </Link>
      </header>

      <LogoShowcase />

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
