import type { Article, ArticleCategory } from "@/types/content";
import { articles as fallbackArticles } from "./mock-data";
import { shouldUseDevelopmentFallback, requireConfiguredDataSource } from "./shared";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { publicMediaUrl } from "@/lib/supabase/media";
import { cache } from "react";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id, slug: row.slug, title: row.title, excerpt: row.excerpt ?? "",
    body: row.body ?? undefined, category: row.category, image: publicMediaUrl("article-media", row.hero_image_path) ?? "coral", imageAlt: row.hero_image_alt ?? undefined,
    publishedAt: row.published_at ? new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", year: "numeric" }).format(new Date(row.published_at)) : "",
    publishedAtIso: row.published_at ?? undefined, modifiedAtIso: row.updated_at ?? undefined,
    featured: row.featured, trendingRank: row.trending_rank ?? undefined,
    eventStartAt: row.event_start_at ?? undefined, eventEndAt: row.event_end_at ?? undefined,
    eventLocation: row.event_location ?? undefined,
    sourceName: row.source_name ?? undefined, sourceUrl: row.source_url ?? undefined,
    eventUrl: row.event_url ?? undefined,
  };
}

async function queryArticles(query: (client: Awaited<ReturnType<typeof createClient>>) => PromiseLike<{ data: ArticleRow[] | null; error: { message: string } | null }>) {
  requireConfiguredDataSource();
  const result = await query(await createClient());
  if (result.error) throw new Error(`Unable to load articles: ${result.error.message}`);
  return (result.data ?? []).map(mapArticle);
}

export function getPublishedArticles() {
  if (shouldUseDevelopmentFallback()) return Promise.resolve(fallbackArticles);
  return queryArticles((client) => client.from("articles").select("*").eq("status", "published").order("published_at", { ascending: false }));
}

export function getArticlesByCategory(category: ArticleCategory) {
  if (shouldUseDevelopmentFallback()) {
    const items = fallbackArticles.filter((article) => article.category === category);
    return Promise.resolve(category === "event" ? items.filter((article) => article.eventEndAt && new Date(article.eventEndAt) >= new Date()).sort((a,b) => new Date(a.eventStartAt??0).valueOf()-new Date(b.eventStartAt??0).valueOf()) : items);
  }
  if (category === "event") {
    return queryArticles((client) => client.from("articles").select("*").eq("status", "published").eq("category", "event").gte("event_end_at", new Date().toISOString()).order("event_start_at", { ascending: true }));
  }
  return queryArticles((client) => client.from("articles").select("*").eq("status", "published").eq("category", category).order("published_at", { ascending: false }));
}

export function getTrendingArticles() {
  if (shouldUseDevelopmentFallback()) return Promise.resolve(fallbackArticles.filter((article) => article.trendingRank).sort((a,b)=>(a.trendingRank??0)-(b.trendingRank??0)));
  return queryArticles((client) => client.from("articles").select("*").eq("status", "published").not("trending_rank", "is", null).order("trending_rank", { ascending: true }));
}

export function getFeaturedArticles() {
  if (shouldUseDevelopmentFallback()) return Promise.resolve(fallbackArticles.filter((article) => article.featured));
  return queryArticles((client) => client.from("articles").select("*").eq("status", "published").eq("featured", true).order("published_at", { ascending: false }));
}

export const getArticleBySlug = cache(async function getArticleBySlug(slug: string) {
  if (shouldUseDevelopmentFallback()) return fallbackArticles.find((article) => article.slug === slug) ?? null;
  requireConfiguredDataSource();
  const { data, error } = await (await createClient()).from("articles").select("*").eq("status", "published").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Unable to load article: ${error.message}`);
  return data ? mapArticle(data) : null;
});
