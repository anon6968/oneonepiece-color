export type LogoMotion = "calm" | "wind" | "rock" | "storm";

const BASE = "/logo-anim";

/**
 * Animated brand logo — story-first motion.
 *
 * On load the engraving DEVELOPS from black-and-white into full colour (the
 * "colorized" brand promise) via a single filter tween on the whole composite,
 * then settles. In idle only the flag & pennants flutter at the masthead and
 * the sea shimmers — the wordmark and hull stay rock-steady and legible, and
 * the whole stage breathes as one unit so the waterline can never tear.
 *
 * PNG layers are cut from the master art (public/logo-anim/*):
 *   base     — ship, sails and wordmark (flag/pennants/water removed)
 *   pennants — the streamers on the left masts, flutter in the breeze
 *   flag     — the jolly-roger flag, flaps at the masthead
 *   water    — the waves; shimmers in place (brightness only, never moves)
 * Moving layers blend with `screen`, so their black areas stay invisible.
 *
 * `motion` scales the idle intensity: calm < wind < rock < storm.
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
      <div className="l-stage">
        <div className="l-ship">
          <img className="l-base" src={`${BASE}/base.png`} alt="" loading={loading} decoding="async" />
          <img className="l-pennants" src={`${BASE}/pennants.png`} alt="" loading={loading} decoding="async" />
          <img className="l-flag" src={`${BASE}/flag.png`} alt="" loading={loading} decoding="async" />
        </div>
        <img className="l-water" src={`${BASE}/water.png`} alt="" loading={loading} decoding="async" />
      </div>
    </div>
  );
}
