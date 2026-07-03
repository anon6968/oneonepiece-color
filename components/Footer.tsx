import Link from "next/link";
import { groupBySaga, stats } from "@/lib/data";
import { SITE } from "@/lib/site";

export default function Footer() {
  const sagas = groupBySaga();
  const s = stats();
  return (
    <footer className="mt-16 bg-ink-2/60">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2 font-extrabold">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-2">
                🏴‍☠️
              </span>
              One Piece <span className="text-brand">Color</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
              {SITE.tagline} {s.total} chapters in color, updated through chapter {s.last}.
              Free, no signup, works on any device.
            </p>
          </div>

          {sagas.length > 0 && (
            <nav aria-label="Browse by saga">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-mute">
                Browse One Piece color manga by saga
              </h2>
              <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
                {sagas.map((sg) => (
                  <li key={sg.saga}>
                    <Link
                      href={`/chapters#${slug(sg.saga)}`}
                      className="text-mute hover:text-brand"
                    >
                      {sg.saga}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <div className="mt-10 pt-6 text-xs leading-relaxed text-mute/70">
          <p>
            One Piece is created by Eiichiro Oda and published by Shueisha. This is a
            fan-made colorized reading archive; all rights to the original work belong to their
            respective owners. Support the official release.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {SITE.name}. Read One Piece colored manga online free.
          </p>
        </div>
      </div>
    </footer>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
