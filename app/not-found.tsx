import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-28 text-center">
      <div className="text-6xl">🧭</div>
      <h1 className="mt-4 text-2xl font-black">This page sailed off the map</h1>
      <p className="mt-2 text-sm text-mute">
        We couldn&apos;t find that chapter. It may not be colorized yet, or the number is off.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/"
          className="rounded-xl bg-gradient-to-r from-brand to-brand-2 px-5 py-2.5 text-sm font-bold text-white"
        >
          Home
        </Link>
        <Link
          href="/chapters"
          className="rounded-xl border border-line bg-panel px-5 py-2.5 text-sm font-semibold"
        >
          All chapters
        </Link>
      </div>
    </div>
  );
}
