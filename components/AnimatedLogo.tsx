export type LogoMotion = "calm" | "wind" | "rock" | "storm";

const BASE = "/logo-anim";

/**
 * Animated brand logo — the pirate ship art cut into layers so the flag and
 * pennants wave in the wind and the sea rises and falls beneath the hull.
 *
 * The four PNG layers are cut from the master art (public/logo-anim/*):
 *   base     — ship, sails and wordmark (flag/pennants/water removed)
 *   water    — the waves, bobs up and down
 *   pennants — the streamers on the left masts, wave in the breeze
 *   flag     — the jolly-roger flag, flaps at the masthead
 * Moving layers blend with `screen`, so their black areas stay invisible and
 * the transforms never reveal a hard rectangular edge.
 */
export default function AnimatedLogo({
  motion = "calm",
  className = "",
  priority = false,
  alt = "Colorized Manga — animated pirate ship logo",
}: {
  motion?: LogoMotion;
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  const loading = priority ? "eager" : "lazy";
  return (
    <div className={`logo-anim anim-${motion} ${className}`} role="img" aria-label={alt}>
      <div className="l-ship">
        <img className="l-base" src={`${BASE}/base.png`} alt="" loading={loading} decoding="async" />
        <img className="l-pennants" src={`${BASE}/pennants.png`} alt="" loading={loading} decoding="async" />
        <img className="l-flag" src={`${BASE}/flag.png`} alt="" loading={loading} decoding="async" />
      </div>
      <img className="l-water" src={`${BASE}/water.png`} alt="" loading={loading} decoding="async" />
    </div>
  );
}
