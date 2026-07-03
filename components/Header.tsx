import Link from "next/link";
import { liveMangas } from "@/lib/manga";
import { pageUrl } from "@/lib/site";
import HeaderResume from "./HeaderResume";

export default function Header() {
  // The nav stays a fixed size no matter how many series we add: individual
  // titles live in "All Manga", and the only per-title control is the single
  // "Continue reading" pill (the reader's most recent series).
  const resumeSeries = liveMangas().map((m) => ({
    slug: m.slug,
    title: m.title,
    unit: m.unit,
    poster: m.poster ?? pageUrl(m, 1, 1),
  }));

  return (
    // Deliberately not sticky — it scrolls away so content (and the chapter
    // browser's own top-0 toolbar) gets the full viewport.
    <header className="relative z-40 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl 2xl:max-w-7xl items-center gap-3 px-4">
        <Link href="/" aria-label="Colorized Manga home" className="group flex items-center gap-2 font-extrabold tracking-tight">
          <img
            src="/logo-mark.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 transition group-hover:brightness-110"
          />
          <span className="text-[15px] sm:text-base">
            Colorized <span className="text-brand">Manga</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 text-sm text-mute sm:flex">
          <Link href="/" className="rounded-md px-3 py-1.5 hover:bg-panel hover:text-fg">
            Home
          </Link>
          <Link href="/#library" className="rounded-md px-3 py-1.5 hover:bg-panel hover:text-fg">
            All Manga
          </Link>
        </nav>

        {/* Fixed-size resume control; renders only when there's reading progress. */}
        <HeaderResume series={resumeSeries} />

        {/* On mobile the bottom MobileNav handles navigation. */}
      </div>
    </header>
  );
}
