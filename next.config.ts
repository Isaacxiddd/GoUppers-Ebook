import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project (a stray pnpm-lock.yaml lives in $HOME).
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  experimental: {
    // Tree-shake the Phosphor icon barrel so client bundles only ship the
    // icons actually used (smaller mobile JS payload).
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
