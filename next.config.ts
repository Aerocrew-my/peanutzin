import type { NextConfig } from "next";

function supabaseStoragePattern(): URL[] {
  const configured = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!configured) return [];

  try {
    const base = new URL(configured);
    if (base.protocol !== "https:") return [];
    return [new URL("/storage/v1/object/public/**", base)];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  images: {
    remotePatterns: supabaseStoragePattern(),
  },
};

export default nextConfig;
