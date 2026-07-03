import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
      <Image
        src="/logo-hero.png"
        alt="Colorized Manga logo"
        width={1000}
        height={1000}
        unoptimized
        className="h-auto w-52"
      />
      <h1 className="mt-6 text-2xl font-black">This page sailed off the map</h1>
      <p className="mt-2 text-sm text-mute">
        We couldn&apos;t find that page. The chapter may not be colorized yet, or the address is off.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-bold text-white"
        >
          Home
        </Link>
        <Link
          href="/one-piece"
          className="rounded-xl bg-panel px-5 py-2.5 text-sm font-semibold transition hover:bg-panel-2"
        >
          Read One Piece in color
        </Link>
      </div>
    </div>
  );
}
