import type { ComponentProps } from "react";

type StaticLinkProps = ComponentProps<"a"> & {
  prefetch?: boolean;
};

/**
 * An ordinary anchor for the fully static Cloudflare export.
 *
 * The deploy artifact intentionally omits Next's RSC route payloads to stay
 * below the host's file limit. A normal document navigation therefore avoids
 * a guaranteed RSC 404 while retaining the same crawlable href semantics.
 */
export default function StaticLink({ prefetch: _prefetch, ...props }: StaticLinkProps) {
  return <a {...props} />;
}
