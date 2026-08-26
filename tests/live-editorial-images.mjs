import assert from "node:assert/strict";import{readFileSync}from"node:fs";
const env=Object.fromEntries(readFileSync(".env.local","utf8").split(/\r?\n/).filter(x=>x&&!x.startsWith("#")&&x.includes("=")).map(x=>{const i=x.indexOf("=");return[x.slice(0,i),x.slice(i+1)]})),url=env.NEXT_PUBLIC_SUPABASE_URL,anon=env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const expected={
 "klibf-2027-plans-british-council-partnership":["editorial/phase-7/klibf-2027-exchange-editorial.png","PEANUTZIN editorial artwork reading Kuala Lumpur ↔ UK and Books / Ideas / Exchange",3073438],
 "pena-malaysia-madani-opens-2026-manuscript-call":["editorial/phase-7/pena-manuscript-call-editorial.png","PEANUTZIN editorial artwork reading Manuskrip, PENA × Malaysia MADANI and 31 Dis 2026",3533438],
 "social-media-connects-writers-and-readers-at-klibf-2026":["editorial/phase-7/klibf-social-community-editorial.png","PEANUTZIN collage reading Books + People + Conversation with books, a phone and speech bubbles",3486170],
 "bazar-buku-antarabangsa-johor-2026":["editorial/phase-7/johor-book-bazaar-editorial.png","PEANUTZIN editorial artwork reading Johor Buku, 21–25 Ogos, with book spines and a paper ticket",3303701],
 "selangor-international-book-fair-2026":["editorial/phase-7/selangor-book-fair-editorial.png","PEANUTZIN editorial artwork reading SIBF Selangor, 27 Nov — 6 Dis, with open books",2818757],
};
const response=await fetch(`${url}/rest/v1/articles?slug=in.(${Object.keys(expected).join(",")})&select=slug,hero_image_path,hero_image_alt`,{headers:{apikey:anon,Authorization:`Bearer ${anon}`}});assert.equal(response.status,200);const rows=await response.json();assert.equal(rows.length,5);
for(const row of rows){const[path,alt,size]=expected[row.slug];assert.equal(row.hero_image_path,path);assert.equal(row.hero_image_alt,alt);assert.match(path,/^editorial\/phase-7\//);const image=await fetch(`${url}/storage/v1/object/public/article-media/${path}`,{cache:"no-store"});assert.equal(image.status,200);assert.equal(image.headers.get("content-type")?.split(";")[0],"image/png");assert.equal((await image.arrayBuffer()).byteLength,size);}
const app=process.env.PEANUTZIN_APP_URL??"http://127.0.0.1:3010",routes=["/","/news","/events",...Object.keys(expected).map(slug=>`/stories/${slug}`)];
for(const route of routes){const page=await fetch(`${app}${route}`);assert.equal(page.status,200,`${route} must render`);const html=await page.text();assert.doesNotMatch(html,/404|Application error/i);if(route.startsWith("/stories/")){const slug=route.split("/").at(-1),[path,alt]=expected[slug];assert.match(html,new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")));assert.ok(html.includes(alt));}}
console.log("live editorial images: PASS (five records, public PNGs, home/listings, five detail routes)");
