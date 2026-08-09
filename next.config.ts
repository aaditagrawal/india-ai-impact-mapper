import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: [
      "radix-ui",
      "@phosphor-icons/react",
      "@base-ui/react",
    ],
  },
};

export default nextConfig;
