import Link from "next/link";
import { AdminShell, DataError } from "@/components/admin/shell";
import { createClient } from "@/lib/supabase/server";

export default async function Admin() {
  const supabase = await createClient();
  const results = await Promise.all([
    supabase.from("articles").select("*", { count: "exact", head: true }),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("category", "event"),
    supabase.from("books").select("*", { count: "exact", head: true }),
    supabase.from("books").select("*", { count: "exact", head: true }).eq("active", true),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("social_drafts").select("*", { count: "exact", head: true }),
    supabase.from("social_publications").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("customer_user_id").not("customer_user_id","is",null),
    supabase.from("newsletter_subscribers").select("*",{count:"exact",head:true}).eq("status","subscribed"),
  ]);
  const metrics = [
    ["Articles", results[0].count, "teal"], ["Published", results[1].count, "teal"],
    ["Drafts", results[2].count, "coral"], ["Events", results[3].count, "coral"],
    ["Books", results[4].count, "yellow"], ["Active Books", results[5].count, "yellow"],
    ["Orders", results[6].count, "blue"], ["Social Drafts", results[7].count, "blue"],
    ["Publications", results[8].count, "teal"],
    ["Customers",new Set((results[9].data??[]).map(row=>row.customer_user_id)).size,"coral"],
    ["Newsletter Subscribers",results[10].count,"yellow"],
  ] as const;
  const failed = results.some((result,index) => result.error || (index!==9&&result.count === null));
  return <AdminShell section="Dashboard"><h1>Dashboard</h1>{failed ? <DataError message="One or more dashboard metrics could not be loaded." /> : <div className="metrics">{metrics.map(([label,value,tone]) => <div className={`metric ${tone}`} key={label}><span>{label}</span><strong>{value}</strong><small>current records</small></div>)}</div>}<div className="admin-panel"><h2>Quick actions</h2><div className="button-row"><Link className="button button-coral" href="/admin/articles/new">New article</Link><Link className="button button-outline" href="/admin/books/new">New book</Link></div></div></AdminShell>;
}
