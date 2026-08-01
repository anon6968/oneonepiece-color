"use client";

import { usePathname } from "next/navigation";

/** Renders children on every route except the landing page — the home hero
 *  carries the branding itself, so the nav bar would be redundant there. */
export default function HideOnHome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return <>{children}</>;
}
