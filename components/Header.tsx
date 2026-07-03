import Link from "next/link";
import ChapterJump from "./ChapterJump";
import { stats } from "@/lib/data";

export default function Header() {
  const s = stats();
  return (
    <header className="sticky top-0 z-40 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4">
        <Link href="/" className="group flex items-center gap-2 font-extrabold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-2 text-sm shadow-lg shadow-brand/30">
            🏴‍☠️
          </span>
          <span className="text-[15px] sm:text-base">
            One Piece <span className="text-brand">Color</span>
          </span>
        </Link>

        <nav className="ml-2 hidden items-center gap-1 text-sm text-mute sm:flex">
          <Link href="/" className="rounded-md px-3 py-1.5 hover:bg-panel hover:text-fg">
            Home
          </Link>
          <Link href="/chapters" className="rounded-md px-3 py-1.5 hover:bg-panel hover:text-fg">
            All Chapters
          </Link>
          {s.last > 0 && (
            <Link
              href={`/read/${s.last}`}
              className="rounded-md px-3 py-1.5 hover:bg-panel hover:text-fg"
            >
              Latest
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ChapterJump max={s.last} />
        </div>
      </div>
    </header>
  );
}
