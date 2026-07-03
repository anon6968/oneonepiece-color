"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { liveMangas } from "@/lib/manga";
import { mangaPath } from "@/lib/site";

const HOME_ICON = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12l9-8 9 8" />
    <path d="M5 10v9a1 1 0 001 1h3v-5h6v5h3a1 1 0 001-1v-9" />
  </svg>
);

const BROWSE_ICON = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

export default function MobileNav() {
  const pathname = usePathname();
  const live = liveMangas();

  // Five tabs max — Home, the three headline series, Browse. More than that
  // stops fitting a phone; the full library is one tap away via Browse. If
  // you're on a series that didn't make the cut, it replaces the third slot
  // so the active tab is always visible.
  const featured = live.slice(0, 3);
  const current = live.find((m) => pathname.startsWith(mangaPath(m.slug)));
  if (current && !featured.includes(current)) featured[2] = current;

  const items: { href: string; label: string; icon?: React.ReactNode; mark?: string }[] = [
    { href: "/", label: "Home", icon: HOME_ICON },
    ...featured.map((m) => ({
      href: mangaPath(m.slug),
      label: m.title,
      mark: m.mark,
    })),
    { href: "/#library", label: "Browse", icon: BROWSE_ICON },
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line/60 bg-ink/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl sm:hidden"
    >
      <div className="flex items-stretch">
        {items.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium transition ${
                active ? "text-brand" : "text-mute"
              }`}
            >
              {item.icon ? (
                <span className={active ? "text-brand" : "text-mute"}>{item.icon}</span>
              ) : (
                <span className="text-base leading-none">{item.mark}</span>
              )}
              <span className="w-full truncate px-1 text-center">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
