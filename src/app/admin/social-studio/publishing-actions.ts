"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/auth";
import { createClient } from "@/lib/supabase/server";
import { isPublishPlatform, platformCopy, socialPayload } from "@/lib/social/publication";
import { sendToMake } from "@/lib/social/publication-server";
import { publicMediaUrl } from "@/lib/supabase/media";

export type PublishState={error?:string;success?:string;results?:Array<{platform:string;status:string;message:string}>};
const value=(form:FormData,key:string,max=100)=>String(form.get(key)??"").trim().slice(0,max);

export async function publishSocialDraft(_previous:PublishState,form:FormData):Promise<PublishState>{
  const admin=await requireAdmin(),draftId=value(form,"draft_id",36),batch=value(form,"attempt_reference",80);
  const platforms=form.getAll("platform").map(String).filter(isPublishPlatform);
  if(!draftId||!batch||!platforms.length)return{error:"Select at least one platform."};
  const supabase=await createClient();
  const {data:draft}=await supabase.from("social_drafts").select("*,articles(hero_image_path,source_url,event_url)").eq("id",draftId).maybeSingle();
  if(!draft||draft.status!=="ready")return{error:"Only a human-reviewed draft with Ready status can be published or exported."};
  const article=Array.isArray(draft.articles)?draft.articles[0]:draft.articles;
  const results=[];
  for(const platform of platforms){
    const copy=platformCopy(draft as unknown as Record<string,unknown>,platform);
    if(!copy){results.push({platform,status:"failed",message:"Platform copy is missing."});continue;}
    const attemptReference=`${batch}:${platform}`;
    const inserted=await supabase.from("social_publications").insert({social_draft_id:draft.id,platform,status:"pending",method:"make",attempt_reference:attemptReference,created_by:admin.id,published_at:null,external_reference:null,error_message:null}).select("id").single();
    if(inserted.error){results.push({platform,status:"duplicate",message:"This publication attempt was already submitted."});continue;}
    const mediaPath=article?.hero_image_path; const mediaUrl=mediaPath?.includes("/")?publicMediaUrl("article-media",mediaPath):null;
    const sent=await sendToMake(socialPayload({publicationId:inserted.data.id,attemptReference,draftId:draft.id,platform,copy,hashtags:draft.hashtags,sourceUrl:article?.event_url??article?.source_url,mediaUrl}));
    await supabase.from("social_publications").update(sent.ok?{status:"sent",external_reference:sent.externalReference,error_message:null}:{status:"failed",error_message:sent.error}).eq("id",inserted.data.id).eq("status","pending");
    results.push({platform,status:sent.ok?"sent":"failed",message:sent.ok?"Sent to Make.com; publication is awaiting confirmation.":sent.error});
  }
  revalidatePath("/admin/social-studio"); return{success:"Publication workflow completed.",results};
}

export async function markPublishedManually(_previous:PublishState,form:FormData):Promise<PublishState>{
  const admin=await requireAdmin(),draftId=value(form,"draft_id",36),platformValue=value(form,"platform",20),attempt=value(form,"attempt_reference",80);
  if(!isPublishPlatform(platformValue)||!draftId||!attempt)return{error:"Invalid manual publication request."};
  const supabase=await createClient(); const {data:draft}=await supabase.from("social_drafts").select("status").eq("id",draftId).maybeSingle();
  if(draft?.status!=="ready")return{error:"Only a Ready draft can be marked as manually published."};
  const {error}=await supabase.from("social_publications").insert({social_draft_id:draftId,platform:platformValue,status:"manual",method:"manual",attempt_reference:`${attempt}:${platformValue}`,published_at:new Date().toISOString(),created_by:admin.id,external_reference:null,error_message:null});
  if(error)return{error:"This manual publication attempt already exists."};
  revalidatePath("/admin/social-studio");return{success:`${platformValue} marked as published manually. No API confirmation was claimed.`};
}
