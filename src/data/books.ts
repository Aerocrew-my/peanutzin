import type { Book } from "@/types/content";
import { books as fallbackBooks } from "./mock-data";
import { shouldUseDevelopmentFallback, requireConfiguredDataSource } from "./shared";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/database.types";
import { publicMediaUrl } from "@/lib/supabase/media";
import { cache } from "react";

type BookRow = Database["public"]["Tables"]["books"]["Row"];
function mapBook(row: BookRow): Book { return { id: row.id, slug: row.slug, title: row.title, author: row.author, priceCents: row.price_cents, currency: row.currency, cover: publicMediaUrl("book-covers", row.cover_image_path) ?? "coral", description: row.description ?? undefined, featured: row.featured, stockQuantity: row.stock_quantity }; }
async function queryBooks(query: (client: Awaited<ReturnType<typeof createClient>>) => PromiseLike<{ data: BookRow[] | null; error: { message: string } | null }>) {
  if (shouldUseDevelopmentFallback()) return fallbackBooks;
  requireConfiguredDataSource();
  const result = await query(await createClient());
  if (result.error) throw new Error(`Unable to load books: ${result.error.message}`);
  return (result.data ?? []).map(mapBook);
}
export function getActiveBooks() { return queryBooks((client) => client.from("books").select("*").eq("active", true).order("featured", { ascending: false }).order("title")); }
export function getFeaturedBooks() { return queryBooks((client) => client.from("books").select("*").eq("active", true).eq("featured", true).order("title")); }
export const getBookBySlug = cache(async function getBookBySlug(slug: string) {
  if (shouldUseDevelopmentFallback()) return fallbackBooks.find((book) => book.slug === slug) ?? null;
  requireConfiguredDataSource();
  const { data, error } = await (await createClient()).from("books").select("*").eq("active", true).eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Unable to load book: ${error.message}`);
  return data ? mapBook(data) : null;
});
