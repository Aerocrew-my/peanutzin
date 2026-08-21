import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
try{for(const line of (await readFile(new URL("../.env.local",import.meta.url),"utf8")).split(/\r?\n/)){const i=line.indexOf("=");if(i>0&&!line.startsWith("#")&&!process.env[line.slice(0,i)])process.env[line.slice(0,i)]=line.slice(i+1);}}catch{/* Deployment environments provide variables directly. */}
const url=process.env.NEXT_PUBLIC_SUPABASE_URL,anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,email=process.env.PEANUTZIN_TEST_ADMIN_EMAIL,password=process.env.PEANUTZIN_TEST_ADMIN_PASSWORD;
if(!url||!anon||!email||!password)throw new Error("Supabase URL, anon key, and active admin credentials are required for least-privilege media sync.");
if(!url.includes("kdyquipcyynugdyagecr"))throw new Error("Refusing to upload: the configured Supabase project is not the authorized PEANUTZIN project.");
const client=createClient(url,anon,{auth:{persistSession:false}}),signedIn=await client.auth.signInWithPassword({email,password});if(signedIn.error)throw new Error("Admin sign-in failed for media sync.");
const assets=[
 ["johor-book-bazaar.png","editorial/real-content-2026/johor-book-bazaar-45c076768c8d.png",2376427],
 ["klibf-2027-partnership.png","editorial/real-content-2026/klibf-2027-partnership-be42c6c98df0.png",2458603],
 ["klibf-social-community.png","editorial/real-content-2026/klibf-social-community-76782936a6f0.png",2347607],
 ["pena-manuscript-call.png","editorial/real-content-2026/pena-manuscript-call-482a5e295384.png",2313380],
 ["selangor-book-fair.png","editorial/real-content-2026/selangor-book-fair-f84ea475d74d.png",2556344],
];
const root=new URL("../supabase/assets/article-media/articles/",import.meta.url);
for(const[name,path,size]of assets){const body=await readFile(new URL(name,root));if(body.length!==size)throw new Error(`Local size mismatch for ${name}.`);const uploaded=await client.storage.from("article-media").upload(path,body,{contentType:"image/png",upsert:false});if(uploaded.error)throw new Error(`Upload failed for ${path}: ${uploaded.error.message}`);const publicUrl=client.storage.from("article-media").getPublicUrl(path).data.publicUrl,response=await fetch(publicUrl,{cache:"no-store"});if(!response.ok||response.headers.get("content-type")?.split(";")[0]!=="image/png"||(await response.arrayBuffer()).byteLength!==size)throw new Error(`Public verification failed for ${path}.`);console.log(`Verified ${path} image/png ${size} bytes`);}
