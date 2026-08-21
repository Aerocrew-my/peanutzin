import "server-only";
import type { socialPayload } from "./publication";
export async function sendToMake(payload: ReturnType<typeof socialPayload>, webhook=process.env.MAKE_SOCIAL_WEBHOOK_URL?.trim()){
 if(!webhook)return{ok:false as const,error:"Make.com webhook is not configured. Use the manual workflow."};
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 try{const response=await fetch(webhook,{method:"POST",signal:controller.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),cache:"no-store"});const body=await response.json().catch(()=>null) as {reference?:unknown;external_reference?:unknown}|null;if(!response.ok)return{ok:false as const,error:`Make.com returned HTTP ${response.status}.`};if(body!==null&&(typeof body!=="object"||Array.isArray(body)))return{ok:false as const,error:"Make.com returned a malformed response."};const reference=typeof body?.external_reference==="string"?body.external_reference:typeof body?.reference==="string"?body.reference:null;return{ok:true as const,externalReference:reference};}
 catch(error){return{ok:false as const,error:error instanceof DOMException&&error.name==="AbortError"?"Make.com timed out.":"Make.com could not be reached."};}finally{clearTimeout(timer);}
}
