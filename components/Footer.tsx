import Link from "next/link";
import { MANGAS, liveMangas } from "@/lib/manga";
import { groupBySaga, sagaSlug, stats } from "@/lib/data";
import { chaptersPath, mangaPath, SITE } from "@/lib/site";

export default function Footer() {
  const live = liveMangas();
  return (
    <footer className="mt-16 border-t border-line/60 bg-ink-2/70">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-extrabold">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-blood to-brand ring-1 ring-brand/40">
                🏴‍☠️
              </span>
              Colorized <span className="text-brand">Manga</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
              {SITE.description}
            </p>
          </div>

          <nav aria-label="Browse manga">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-mute">
              Colorized manga
            </h2>
            <ul className="grid gap-1.5 text-sm">
              {MANGAS.map((m) => (
                <li key={m.slug}>
                  <Link href={mangaPath(m.slug)} className="text-mute hover:text-brand">
                    {m.title} in color
                    {m.status === "coming-soon" && (
                      <span className="ml-1 text-[10px] uppercase tracking-wide text-mute/60">
                        soon
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {live.map((m) => {
            const sagas = groupBySaga(m.slug);
            if (!sagas.length) return null;
            return (
              <nav key={m.slug} aria-label={`Browse ${m.title} by saga`}>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-mute">
                  {m.title} by saga
                </h2>
                <ul className="grid grid-cols-2 gap-x-5 gap-y-1.5 text-sm">
                  {sagas.map((sg) => (
                    <li key={sg.saga}>
                      <Link
                        href={`${chaptersPath(m.slug)}#${sagaSlug(sg.saga)}`}
                        className="text-mute hover:text-brand"
                      >
                        {sg.saga}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            );
          })}
        </div>

        <div className="mt-10 border-t border-line/50 pt-6 text-xs leading-relaxed text-mute/70">
          <p>
            All series are the property of their respective authors and publishers
            {live.length ? (
              <>
                {" "}
                — {live.map((m) => `${m.title} by ${m.author}`).join("; ")}
              </>
            ) : null}
            . This is a fan-made colorized reading archive; all rights to the original works
            belong to their owners. Please support the official releases.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {SITE.name}. Read colorized manga online free.
            {live[0] && (
              <>
                {" "}
                {stats(live[0].slug).colored} {live[0].title} chapters in full color.
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
