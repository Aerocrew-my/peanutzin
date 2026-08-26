"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin/auth";

export type ActionState = { error?: string };
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function text(form: FormData, key: string) { return String(form.get(key) ?? "").trim(); }
function nullable(form: FormData, key: string) { return text(form, key) || null; }
function iso(value: string) { if (!value) return null; const date = new Date(value); return Number.isNaN(date.valueOf()) ? undefined : date.toISOString(); }
function friendly(message: string) { return message.includes("duplicate key") ? "That slug is already in use." : "The change could not be saved. Please try again."; }

async function upload(form: FormData, field: string, bucket: "article-media" | "book-covers", folder: string) {
  const file = form.get(field);
  if (!(file instanceof File) || !file.size) return null;
  if (!imageTypes.has(file.type)) throw new Error("Images must be JPEG, PNG, or WebP.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Images must be 5 MB or smaller.");
  const ext = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const supabase = await createClient();
  const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error("Image upload failed.");
  return path;
}

export async function login(_state: ActionState, form: FormData): Promise<ActionState> {
  const email = text(form, "email"), password = text(form, "password");
  if (!email || !password) return { error: "Enter your email and password." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Invalid email or password." };
  const { data: membership } = await supabase.from("admin_users").select("active").eq("id", data.user.id).maybeSingle();
  if (!membership?.active) { await supabase.auth.signOut(); return { error: "This account does not have active CMS access." }; }
  redirect("/admin");
}

export async function logout() { const supabase = await createClient(); await supabase.auth.signOut(); redirect("/admin/login"); }

export async function saveArticle(_state: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = nullable(form, "id"), title = text(form, "title"), slug = text(form, "slug").toLowerCase();
  const category = text(form, "category"), status = text(form, "status");
  const rankText = text(form, "trending_rank"), rank = rankText ? Number(rankText) : null;
  const published = iso(text(form, "published_at")), start = iso(text(form, "event_start_at")), end = iso(text(form, "event_end_at"));
  if (!title || !slugPattern.test(slug)) return { error: "Add a title and a valid lowercase slug." };
  if (!["news","gossip","event","feature"].includes(category) || !["draft","published"].includes(status)) return { error: "Choose a valid category and status." };
  if (rank !== null && (!Number.isInteger(rank) || rank < 1)) return { error: "Trending rank must be a positive whole number." };
  if (published === undefined || start === undefined || end === undefined) return { error: "One or more dates are invalid." };
  if (status === "published" && !published) return { error: "Published articles need a publication date." };
  if (category === "event" && !start && !text(form, "event_location")) return { error: "Events need a start date or location." };
  if (start && end && new Date(end) < new Date(start)) return { error: "Event end must follow its start." };
  try {
    const newImage = await upload(form, "image", "article-media", `articles/${slug}`);
    const values = { title, slug, category: category as "news"|"gossip"|"event"|"feature", status: status as "draft"|"published", excerpt: nullable(form,"excerpt"), body: nullable(form,"body"), hero_image_path: newImage ?? nullable(form,"existing_image"), hero_image_alt: nullable(form,"hero_image_alt"), featured: form.get("featured") === "on", trending_rank: rank, published_at: published ?? null, event_start_at: category === "event" ? start ?? null : null, event_end_at: category === "event" ? end ?? null : null, event_location: category === "event" ? nullable(form,"event_location") : null, event_url: category === "event" ? nullable(form,"event_url") : null, source_name: nullable(form,"source_name"), source_url: nullable(form,"source_url"), seo_title: nullable(form,"seo_title"), seo_description: nullable(form,"seo_description") };
    const supabase = await createClient();
    const result = id ? await supabase.from("articles").update(values).eq("id", id).select("id").single() : await supabase.from("articles").insert(values).select("id").single();
    if (result.error) return { error: friendly(result.error.message) };
    const oldImage = nullable(form, "existing_image");
    if (newImage && oldImage?.includes("/")) await supabase.storage.from("article-media").remove([oldImage]);
  } catch (error) { return { error: error instanceof Error ? error.message : "Unable to save article." }; }
  revalidatePath("/", "layout"); redirect(`/admin/articles?saved=${status}`);
}

export async function deleteArticle(form: FormData) { await requireAdmin(); const id = text(form,"id"); if (id) { const { error } = await (await createClient()).from("articles").delete().eq("id",id); if (error) throw new Error("Unable to delete article."); } revalidatePath("/", "layout"); redirect("/admin/articles?deleted=1"); }

export async function saveBook(_state: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = nullable(form,"id"), title = text(form,"title"), author = text(form,"author"), slug = text(form,"slug").toLowerCase(), price = text(form,"price");
  const stockText = text(form,"stock_quantity"), stock = stockText ? Number(stockText) : null;
  if (!title || !author || !slugPattern.test(slug)) return { error: "Title, author, and a valid lowercase slug are required." };
  if (!/^\d+(?:\.\d{1,2})?$/.test(price)) return { error: "Price must be non-negative with at most two decimal places." };
  if (stock !== null && (!Number.isInteger(stock) || stock < 0)) return { error: "Stock must be a non-negative whole number." };
  try {
    const newImage = await upload(form,"image","book-covers",`books/${slug}`);
    const values = { title, author, slug, description: nullable(form,"description"), price_cents: Math.round(Number(price) * 100), currency: "MYR" as const, cover_image_path: newImage ?? nullable(form,"existing_image"), featured: form.get("featured") === "on", active: form.get("active") === "on", stock_quantity: stock, isbn: nullable(form,"isbn") };
    const supabase = await createClient();
    const result = id ? await supabase.from("books").update(values).eq("id",id).select("id").single() : await supabase.from("books").insert(values).select("id").single();
    if (result.error) return { error: friendly(result.error.message) };
    const oldImage = nullable(form, "existing_image");
    if (newImage && oldImage?.includes("/")) await supabase.storage.from("book-covers").remove([oldImage]);
  } catch (error) { return { error: error instanceof Error ? error.message : "Unable to save book." }; }
  revalidatePath("/", "layout"); redirect("/admin/books?saved=1");
}

export async function deleteBook(form: FormData) { await requireAdmin(); const id=text(form,"id"); if(id){const {error}=await(await createClient()).from("books").delete().eq("id",id);if(error)throw new Error("Unable to delete book.");} revalidatePath("/", "layout"); redirect("/admin/books?deleted=1"); }

export async function saveSettings(_state: ActionState, form: FormData): Promise<ActionState> {
  await requireAdmin(); const supabase=await createClient();
  const rows = [
    {key:"announcement",value:text(form,"announcement")}, {key:"newsletterHeading",value:text(form,"newsletterHeading")}, {key:"newsletterCopy",value:text(form,"newsletterCopy")},
    {key:"contact",value:{email:text(form,"contact_email"),phone:text(form,"contact_phone")}}, {key:"social",value:{instagram:text(form,"instagram"),tiktok:text(form,"tiktok"),facebook:text(form,"facebook")}},
  ];
  const {error}=await supabase.from("site_settings").upsert(rows,{onConflict:"key"}); if(error)return{error:"Settings could not be saved."};
  revalidatePath("/", "layout"); redirect("/admin/settings?saved=1");
}
