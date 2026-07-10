import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "frontend.share.zrok.io",
    "*.zrok.io",
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
  async headers() {
    return [
      {
        // Force crawlers to always re-fetch OG image and favicon
        source: '/(og-image\\.png|logo\\.png|apple-touch-icon\\.png|favicon\\.ico)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
        ],
      },
    ]
  },
};

export default nextConfig;
