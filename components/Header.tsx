import Link from "next/link";
import { liveMangas } from "@/lib/manga";
import { mangaPath } from "@/lib/site";

export default function Header() {
  const live = liveMangas();
  return (
    <header className="sticky top-0 z-40 bg-ink/70 backdrop-blur-xl">
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

        {/* On mobile the bottom MobileNav handles navigation. */}
      </div>
    </header>
  );
}
