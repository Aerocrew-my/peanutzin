import "server-only";
import { AI_CONFIG } from "./config";

export type SocialGeneration = { facebook:string; instagram:string; linkedin:string; threads:string; shortCopy:string; hashtags:string[]; seoTitle:string; seoDescription:string };
export type SocialPlatform = keyof SocialGeneration | "all";

export const SOCIAL_SYSTEM_PROMPT = `You are PEANUTZIN's editorial assistant. PEANUTZIN is an independent Malaysian digital publisher: fun, smart, conversational, curious, social, and literary when appropriate. Write naturally for Malaysian readers without forced slang, fake cultural references, corporate jargon, generic marketing language, exaggerated hype, or excessive emoji.

Treat the supplied brief and optional article as the complete factual source. Never invent names, dates, places, quotes, claims, or context. If facts are insufficient, stay general rather than guessing. Facebook is conversational and moderately descriptive. Instagram is visual, concise, and rhythmic. LinkedIn is thoughtful and professional without sounding corporate. Threads is compact and conversational. Short copy works as a banner or quick promo. Suggest 3–8 restrained, relevant hashtags. SEO title should usually be 50–60 characters and meta description 140–160 characters; clarity and factual accuracy take priority. Return only the requested JSON structure.`;

const schema = {
  type:"object", additionalProperties:false,
  properties:{ facebook:{type:"string"},instagram:{type:"string"},linkedin:{type:"string"},threads:{type:"string"},shortCopy:{type:"string"},hashtags:{type:"array",items:{type:"string"},maxItems:8},seoTitle:{type:"string"},seoDescription:{type:"string"} },
  required:["facebook","instagram","linkedin","threads","shortCopy","hashtags","seoTitle","seoDescription"],
} as const;

export function parseSocialGeneration(value: unknown): SocialGeneration {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("The AI response was malformed.");
  const x=value as Record<string,unknown>, keys=["facebook","instagram","linkedin","threads","shortCopy","seoTitle","seoDescription"] as const;
  for(const key of keys) if(typeof x[key]!=="string" || !x[key].trim()) throw new Error("The AI response was incomplete.");
  if(!Array.isArray(x.hashtags) || x.hashtags.length>8 || x.hashtags.some(v=>typeof v!=="string")) throw new Error("The AI returned invalid hashtags.");
  return {facebook:(x.facebook as string).trim(),instagram:(x.instagram as string).trim(),linkedin:(x.linkedin as string).trim(),threads:(x.threads as string).trim(),shortCopy:(x.shortCopy as string).trim(),hashtags:(x.hashtags as string[]).map(v=>v.trim()).filter(Boolean),seoTitle:(x.seoTitle as string).trim(),seoDescription:(x.seoDescription as string).trim()};
}

export async function generateSocial(input:{brief:string;toneNotes?:string;article?:string;platform?:SocialPlatform}):Promise<{content:SocialGeneration;model:string}> {
  const key=process.env.OPENAI_API_KEY?.trim(); if(!key) throw new Error("AI generation is not configured. Add OPENAI_API_KEY on the server; manual drafts can still be saved.");
  const platform=input.platform??"all";
  const user=`Generate ${platform === "all" ? "all fields" : `a refreshed ${platform} field while still returning every required field`}.
MASTER BRIEF:\n${input.brief}\n${input.toneNotes?`TONE NOTES:\n${input.toneNotes}\n`:""}${input.article?`SOURCE ARTICLE:\n${input.article}`:"No source article was selected. Use only the master brief."}`;
  const controller=new AbortController(), timer=setTimeout(()=>controller.abort(),AI_CONFIG.timeoutMs);
  try {
    const response=await fetch(AI_CONFIG.endpoint,{method:"POST",signal:controller.signal,headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},body:JSON.stringify({model:AI_CONFIG.model,instructions:SOCIAL_SYSTEM_PROMPT,input:user,max_output_tokens:AI_CONFIG.maxOutputTokens,text:{format:{type:"json_schema",name:"social_copy",strict:true,schema}}})});
    const body=await response.json().catch(()=>null) as {output_text?:string;output?:Array<{content?:Array<{type?:string;text?:string}>}>;error?:{message?:string}}|null;
    if(!response.ok){if(response.status===429)throw new Error("OpenAI rate limit reached. Please wait and try again.");throw new Error(response.status>=500?"OpenAI is temporarily unavailable. Your edits are safe.":"OpenAI could not generate content. Check the server configuration and request.");}
    const raw=body?.output_text ?? body?.output?.flatMap(o=>o.content??[]).find(c=>c.type==="output_text")?.text;
    if(!raw)throw new Error("OpenAI returned no usable content.");
    return {content:parseSocialGeneration(JSON.parse(raw)),model:AI_CONFIG.model};
  } catch(error){if(error instanceof DOMException&&error.name==="AbortError")throw new Error("AI generation timed out. Your existing edits are safe.");if(error instanceof SyntaxError)throw new Error("The AI response was malformed. Your existing edits are safe.");throw error;} finally {clearTimeout(timer);}
}
