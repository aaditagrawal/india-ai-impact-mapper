import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["radix-ui", "@phosphor-icons/react"],
  },
};

export default nextConfig;
