import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Legacy One-Piece-only URLs → new multi-manga structure.
      { source: "/read/:n", destination: "/one-piece/chapter/:n", permanent: true },
      { source: "/chapters", destination: "/one-piece/chapters", permanent: true },
    ];
  },
};

export default nextConfig;
