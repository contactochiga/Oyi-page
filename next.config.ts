import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async redirects() {
    return [
      // Repositioning: "Oyi Home" -> "Oyi Experience" (Phase 1 IA refactor).
      { source: "/home", destination: "/experience", permanent: true },
      // Repositioning: "Oyi Intelligence" -> "Oyi Core" (versioned Core
      // language replaces the old "Intelligence" product name).
      { source: "/intelligence", destination: "/core", permanent: true },
    ];
  },
};

export default nextConfig;
