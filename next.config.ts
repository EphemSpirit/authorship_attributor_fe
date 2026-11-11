import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Default is 1MB; document uploads easily exceed that.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;