import type { Metadata } from "next";

export const SITE_NAME = "PEANUTZIN";
export const SITE_URL = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://peanutzin.com");
export const DEFAULT_DESCRIPTION = "Independent Malaysian stories, culture, events and books from PEANUTZIN.";

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = new URL(path, SITE_URL).toString();
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: SITE_NAME, type: "website", images: ["/opengraph-image"] },
    twitter: { card: "summary_large_image", title, description, images: ["/opengraph-image"] },
  };
}

