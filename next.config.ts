import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "frontend.share.zrok.io",
    "*.zrok.io",
  ],
};

export default nextConfig;
