import Link from "next/link";
import { AdminShell } from "@/components/admin/shell";
import { SocialStudioEditor } from "@/components/admin/social-studio";
import { isAiConfigured } from "@/lib/ai/config";
import { createClient } from "@/lib/supabase/server";

export default async function SocialStudio({searchParams}:{searchParams:Promise<{draft?:string}>}){
  const {draft:id}=await searchParams,supabase=await createClient();
  const [{data:articles},{data:drafts},{data:draft},{data:history}]=await Promise.all([
    supabase.from("articles").select("id,title,status,category").order("updated_at",{ascending:false}),
    supabase.from("social_drafts").select("id,title,status,updated_at,source_article_id").order("updated_at",{ascending:false}),
    id?supabase.from("social_drafts").select("*").eq("id",id).maybeSingle():Promise.resolve({data:null}),
    id?supabase.from("social_publications").select("*").eq("social_draft_id",id).order("created_at",{ascending:false}):Promise.resolve({data:[]}),
  ]);
  return <AdminShell section="Social Studio"><div className="admin-title"><h1>Social Studio</h1><Link className="button button-coral" href="/admin/social-studio">New draft</Link></div><p className="studio-intro">Create → AI Generate → Review → Edit → Save → Publish / Export. Nothing publishes without human approval.</p><SocialStudioEditor key={draft?.id??"new"} draft={draft??undefined} articles={articles??[]} configured={isAiConfigured()} makeConfigured={Boolean(process.env.MAKE_SOCIAL_WEBHOOK_URL?.trim())} history={history??[]}/><section className="studio-drafts"><h2>Saved drafts</h2><div className="cms-list">{(drafts??[]).map(item=><Link href={`/admin/social-studio?draft=${item.id}`} key={item.id}><strong>{item.title||"Untitled draft"}</strong><span>{item.status}</span><small>Updated {new Date(item.updated_at).toLocaleDateString("en-MY")}</small></Link>)}{!drafts?.length&&<p>No social drafts yet.</p>}</div></section></AdminShell>;
}
