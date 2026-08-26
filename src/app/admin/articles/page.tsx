import Link from "next/link";
import { AdminShell, DataError, Notice } from "@/components/admin/shell";
import { createClient } from "@/lib/supabase/server";

const categories = ["news", "gossip", "event", "feature"] as const;
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams, supabase = await createClient();
  let query = supabase.from("articles").select("*").order("updated_at", { ascending: false });
  if (q.status === "draft" || q.status === "published") query = query.eq("status", q.status);
  if (categories.some(category => category === q.category)) query = query.eq("category", q.category as typeof categories[number]);
  const { data, error } = await query;
  return <AdminShell section="Articles"><div className="admin-title"><h1>Articles</h1><Link className="button button-coral" href="/admin/articles/new">New article</Link></div><Notice searchParams={q}/><form className="filters"><select name="status" defaultValue={q.status ?? ""}><option value="">All statuses</option><option value="draft">Draft</option><option value="published">Published</option></select><select name="category" defaultValue={q.category ?? ""}><option value="">All categories</option>{categories.map(category => <option key={category}>{category}</option>)}</select><button className="button button-outline">Filter</button></form>{error ? <DataError message={`Articles could not be loaded (${error.message}).`} /> : data?.length ? <div className="cms-list">{data.map(article => <Link href={`/admin/articles/${article.id}`} key={article.id}><strong>{article.title}</strong><span>{article.category} · {article.status}{article.featured ? " · featured" : ""}</span><small>Updated {new Date(article.updated_at).toLocaleDateString("en-MY")}</small></Link>)}</div> : <div className="empty-state"><h2>No matching articles.</h2><p>Try another filter or create an article.</p></div>}</AdminShell>;
}
