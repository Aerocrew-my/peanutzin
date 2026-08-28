import type { Book } from "@/types/content";
import { books as fallbackBooks } from "./mock-data";
import { shouldUseDevelopmentFallback, requireConfiguredDataSource } from "./shared";
import { createPublicClient } from "@/lib/supabase/public";
import type { Database } from "@/lib/supabase/database.types";
import { publicMediaUrl } from "@/lib/supabase/media";
import { cache } from "react";
import { unstable_cache } from "next/cache";

type BookRow = Database["public"]["Tables"]["books"]["Row"];
function mapBook(row: BookRow): Book { return { id: row.id, slug: row.slug, title: row.title, author: row.author, priceCents: row.price_cents, currency: row.currency, cover: publicMediaUrl("book-covers", row.cover_image_path) ?? "coral", description: row.description ?? undefined, featured: row.featured, stockQuantity: row.stock_quantity }; }
async function queryBooks(query: (client: ReturnType<typeof createPublicClient>) => PromiseLike<{ data: BookRow[] | null; error: { message: string } | null }>) {
  if (shouldUseDevelopmentFallback()) return fallbackBooks;
  requireConfiguredDataSource();
  const result = await query(createPublicClient());
  if (result.error) throw new Error(`Unable to load books: ${result.error.message}`);
  return (result.data ?? []).map(mapBook);
}
const queryActiveBooks = unstable_cache(
  () => queryBooks((client) => client.from("books").select("*").eq("active", true).order("featured", { ascending: false }).order("title")),
  ["active-books"], { revalidate: 900, tags: ["books"] },
);
export function getActiveBooks() { return shouldUseDevelopmentFallback() ? Promise.resolve(fallbackBooks) : queryActiveBooks(); }
export async function getFeaturedBooks() { return (await getActiveBooks()).filter((book) => book.featured); }

const queryBookBySlug = unstable_cache(async (slug: string) => {
  const { data, error } = await createPublicClient().from("books").select("*").eq("active", true).eq("slug", slug).maybeSingle();
  if (error) throw new Error(`Unable to load book: ${error.message}`);
  return data ? mapBook(data) : null;
}, ["active-book-by-slug"], { revalidate: 900, tags: ["books"] });
export const getBookBySlug = cache(async function getBookBySlug(slug: string) {
  if (shouldUseDevelopmentFallback()) return fallbackBooks.find((book) => book.slug === slug) ?? null;
  requireConfiguredDataSource();
  return queryBookBySlug(slug);
});
