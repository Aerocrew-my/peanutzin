import { timingSafeEqual } from "node:crypto";
import { createServiceClient } from "@/lib/supabase/admin";

function safeMatch(actual:string,expected:string){const a=Buffer.from(actual),b=Buffer.from(expected);return a.length===b.length&&timingSafeEqual(a,b);}
export async function POST(request:Request){
  const secret=process.env.MAKE_SOCIAL_CALLBACK_SECRET?.trim(),provided=request.headers.get("authorization")?.replace(/^Bearer\s+/i,"")??"";
  if(!secret||!safeMatch(provided,secret))return Response.json({error:"Unauthorized"},{status:401});
  const body=await request.json().catch(()=>null) as {publication_id?:unknown;attempt_reference?:unknown;status?:unknown;external_reference?:unknown;error_message?:unknown}|null;
  if(!body||typeof body.publication_id!=="string"||typeof body.attempt_reference!=="string"||!['published','failed'].includes(String(body.status)))return Response.json({error:"Invalid callback"},{status:400});
  const values=body.status==="published"?{status:"published" as const,published_at:new Date().toISOString(),external_reference:typeof body.external_reference==="string"?body.external_reference.slice(0,500):null,error_message:null}:{status:"failed" as const,error_message:typeof body.error_message==="string"?body.error_message.slice(0,1000):"Platform rejected the publication."};
  const {data,error}=await createServiceClient().from("social_publications").update(values).eq("id",body.publication_id).eq("attempt_reference",body.attempt_reference).eq("status","sent").select("id").maybeSingle();
  if(error)return Response.json({error:"Update failed"},{status:500}); if(!data)return Response.json({error:"Publication attempt not found or not awaiting confirmation"},{status:409});
  return Response.json({ok:true});
}
