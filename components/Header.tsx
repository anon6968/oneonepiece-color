import Link from "next/link";
import { liveMangas } from "@/lib/manga";
import { mangaPath } from "@/lib/site";

export default function Header() {
  const live = liveMangas();
  return (
    <header className="sticky top-0 z-40 bg-ink/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link href="/" aria-label="Colorized Manga home" className="group flex items-center gap-2 font-extrabold tracking-tight">
          <img
            src="/logo-mark.svg"
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 rounded-lg shadow-lg shadow-brand/20 transition group-hover:brightness-110"
          />
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
