import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "@google/genai"],
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
