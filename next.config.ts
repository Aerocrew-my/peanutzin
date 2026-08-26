import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://kdyquipcyynugdyagecr.supabase.co";
const supabaseStorage = new URL("/storage/v1/object/public/**", supabaseUrl);

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  images: {
    remotePatterns: [supabaseStorage],
  },
};

export default nextConfig;
