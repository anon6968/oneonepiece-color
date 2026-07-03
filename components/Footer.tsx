import Link from "next/link";
import { liveMangas } from "@/lib/manga";
import { groupBySaga, sagaSlug, stats } from "@/lib/data";
import { listPath, mangaPath, unitLabelPlural, SITE } from "@/lib/site";

export default function Footer() {
  const live = liveMangas();
  return (
    <footer className="mt-16 bg-ink-2/50">
      <div className="mx-auto max-w-6xl px-4 py-12 2xl:max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-extrabold">
              <img
                src="/logo-mark.png"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8"
              />
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
              {live.map((m) => (
                <li key={m.slug}>
                  <Link href={mangaPath(m.slug)} className="text-mute hover:text-brand">
                    {m.title} in color
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Browse live series">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-mute">
              Read now
            </h2>
            <ul className="grid gap-1.5 text-sm">
              {live.map((m) => {
                const s = stats(m.slug);
                return (
                  <li key={m.slug}>
                    <Link href={listPath(m)} className="text-mute hover:text-brand">
                      All {m.title} {unitLabelPlural(m)}{" "}
                      <span className="text-mute/60">({s.colored})</span>
                    </Link>
                  </li>
                );
              })}
              {live[0] &&
                groupBySaga(live[0].slug)
                  .slice(0, 4)
                  .map((sg) => (
                    <li key={sg.saga}>
                      <Link
                        href={`${listPath(live[0])}#${sagaSlug(sg.saga)}`}
                        className="text-mute hover:text-brand"
                      >
                        {live[0].title}: {sg.saga}
                      </Link>
                    </li>
                  ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 pt-6 text-xs leading-relaxed text-mute/60">
          <p>
            Colorized Manga is an independent, non-commercial fan project showcasing
            fan-made color edits of works
            {live.length ? (
              <>
                {" "}
                such as {live.map((m) => `${m.title} by ${m.author}`).join("; ")}
              </>
            ) : null}
            . It is not affiliated with, authorized, endorsed, or sponsored by any creator,
            publisher, or rights holder. Rights holders may{" "}
            <Link href="/dmca" className="underline hover:text-brand">
              request content removal here
            </Link>
            .
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
          <nav aria-label="Legal" className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            <Link href="/dmca" className="hover:text-brand">
              Content removal / DMCA
            </Link>
            <Link href="/terms" className="hover:text-brand">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-brand">
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
