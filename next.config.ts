import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output only when explicitly requested (e.g. in Docker)
  // This avoids EPERM symlink errors on Windows during local builds
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: "/api/uploads/:path*",
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
