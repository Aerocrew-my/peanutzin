import type { MetadataRoute } from "next";
import { getPublishedArticles } from "@/data/articles";
import { getActiveBooks } from "@/data/books";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, books] = await Promise.all([getPublishedArticles(), getActiveBooks()]);
  const publicPaths = ["", "/news", "/gossips", "/events", "/features", "/books", "/about", "/contact"];
  return [
    ...publicPaths.map((path) => ({ url: new URL(path || "/", SITE_URL).toString(), changeFrequency: path === "" ? "daily" as const : "weekly" as const, priority: path === "" ? 1 : .7 })),
    ...articles.map((article) => ({ url: new URL(`/stories/${article.slug}`, SITE_URL).toString(), changeFrequency: "monthly" as const, priority: .8, images: article.image.startsWith("http") ? [article.image] : undefined })),
    ...books.map((book) => ({ url: new URL(`/books/${book.slug}`, SITE_URL).toString(), changeFrequency: "weekly" as const, priority: .6, images: book.cover.startsWith("http") ? [book.cover] : undefined })),
  ];
}
