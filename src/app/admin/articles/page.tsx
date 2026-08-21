import Link from "next/link";
import { AdminShell, Notice } from "@/components/admin/shell";
import { createClient } from "@/lib/supabase/server";

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const supabase = await createClient();
  let query = supabase.from("articles").select("*").order("updated_at", { ascending: false });
  if (q.status === "draft" || q.status === "published") query = query.eq("status", q.status);
  if (q.category === "news" || q.category === "gossip" || q.category === "event" || q.category === "feature") query = query.eq("category", q.category);
  const { data } = await query;
  return <AdminShell section="Articles"><div className="admin-title"><h1>Articles</h1><Link className="button button-coral" href="/admin/articles/new">New article</Link></div><Notice searchParams={q}/><form className="filters"><select name="status" defaultValue={q.status ?? ""}><option value="">All statuses</option><option value="draft">Draft</option><option value="published">Published</option></select><select name="category" defaultValue={q.category ?? ""}><option value="">All categories</option>{["news", "gossip", "event", "feature"].map(x => <option key={x}>{x}</option>)}</select><button className="button button-outline">Filter</button></form><div className="cms-list">{(data ?? []).map(x => <Link href={`/admin/articles/${x.id}`} key={x.id}><strong>{x.title}</strong><span>{x.category} · {x.status}{x.featured ? " · featured" : ""}</span><small>Updated {new Date(x.updated_at).toLocaleDateString("en-MY")}</small></Link>)}</div></AdminShell>;
}
