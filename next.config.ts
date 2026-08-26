import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  images: {
    remotePatterns: [new URL("https://kdyquipcyynugdyagecr.supabase.co/storage/v1/object/public/**")],
  },
};

export default nextConfig;
