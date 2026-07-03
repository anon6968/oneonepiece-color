import Link from "next/link";
import { liveMangas } from "@/lib/manga";
import { mangaPath } from "@/lib/site";

export default function Header() {
  const live = liveMangas();
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="group flex items-center gap-2 font-extrabold tracking-tight">
          {/* Neutral mark placeholder — the brand logo is managed separately. */}
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-blood to-brand text-sm shadow-lg shadow-brand/30 ring-1 ring-brand/40">
            🏴‍☠️
          </span>
          <span className="text-[15px] sm:text-base">
            Colorized <span className="text-brand">Manga</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 text-sm text-mute sm:flex">
          <Link href="/" className="rounded-md px-3 py-1.5 hover:bg-panel hover:text-fg">
            Home
          </Link>
          {live.map((m) => (
            <Link
              key={m.slug}
              href={mangaPath(m.slug)}
              className="rounded-md px-3 py-1.5 hover:bg-panel hover:text-fg"
            >
              {m.title}
            </Link>
          ))}
          <Link href="/#library" className="rounded-md px-3 py-1.5 hover:bg-panel hover:text-fg">
            All Manga
          </Link>
        </nav>

        <Link
          href="/#library"
          className="ml-auto rounded-lg bg-panel px-3 py-1.5 text-xs font-semibold text-fg hover:bg-panel-2 sm:hidden"
        >
          All Manga
        </Link>
      </div>
    </header>
  );
}
