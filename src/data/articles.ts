import type { Article, ArticleCategory } from "@/types/content";
import { articles as fallbackArticles } from "./mock-data";
import { shouldUseDevelopmentFallback, requireConfiguredDataSource } from "./shared";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { publicMediaUrl } from "@/lib/supabase/media";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt ?? "",
    body: row.body ?? undefined, category: row.category, image: publicMediaUrl("article-media", row.hero_image_path) ?? "coral",
    publishedAt: row.published_at ? new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", year: "numeric" }).format(new Date(row.published_at)) : "",
    featured: row.featured, trendingRank: row.trending_rank ?? undefined,
    eventStartAt: row.event_start_at ?? undefined, eventEndAt: row.event_end_at ?? undefined,
    eventLocation: row.event_location ?? undefined,
  };
}

async function queryArticles(query: (client: Awaited<ReturnType<typeof createClient>>) => PromiseLike<{ data: ArticleRow[] | null; error: { message: string } | null }>) {
  if (shouldUseDevelopmentFallback()) return fallbackArticles;
  requireConfiguredDataSource();
  const result = await query(await createClient());
  if (result.error) throw new Error(`Unable to load articles: ${result.error.message}`);
  return (result.data ?? []).map(mapArticle);
}

export function getPublishedArticles() {
  return queryArticles((client) => client.from("articles").select("*").eq("status", "published").order("published_at", { ascending: false }));
}

export function getArticlesByCategory(category: ArticleCategory) {
  return queryArticles((client) => client.from("articles").select("*").eq("status", "published").eq("category", category).order("published_at", { ascending: false }));
}

export function getTrendingArticles() {
  return queryArticles((client) => client.from("articles").select("*").eq("status", "published").not("trending_rank", "is", null).order("trending_rank", { ascending: true }));
}

export function getFeaturedArticles() {
  return queryArticles((client) => client.from("articles").select("*").eq("status", "published").eq("featured", true).order("published_at", { ascending: false }));
}

export async function getArticleBySlug(slug: string) {
  if (shouldUseDevelopmentFallback()) return fallbackArticles.find((article) => article.slug === slug) ?? null;
  requireConfiguredDataSource();
  const { data, error } = await (await createClient()).from("articles").select("*").eq("status", "published").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Unable to load article: ${error.message}`);
  return data ? mapArticle(data) : null;
}
