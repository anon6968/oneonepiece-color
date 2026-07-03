import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Legacy One-Piece-only URLs → new multi-manga structure.
      { source: "/read/:n", destination: "/one-piece/chapter/:n", permanent: true },
      { source: "/chapters", destination: "/one-piece/chapters", permanent: true },
      // Naruto is served per-volume — send chapter-style URLs to volume routes.
      { source: "/naruto/chapter/:n", destination: "/naruto/volume/:n", permanent: true },
      { source: "/naruto/chapters", destination: "/naruto/volumes", permanent: true },
    ];
  },
};

export default nextConfig;
