import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source=await readFile(new URL("../src/lib/ai/social.ts",import.meta.url),"utf8");
const migration=await readFile(new URL("../supabase/migrations/202608210006_ai_social_studio.sql",import.meta.url),"utf8");
test("structured schema requires every editorial output",()=>{for(const key of ["facebook","instagram","linkedin","threads","shortCopy","hashtags","seoTitle","seoDescription"])assert.match(source,new RegExp(`required:\\[[^\\]]*|${key}`));});
test("prompt contains factual and brand safeguards",()=>{assert.match(source,/Never invent/);assert.match(source,/Malaysian/);assert.match(source,/exaggerated hype/);});
test("social drafts are RLS protected for active admins",()=>{assert.match(migration,/enable row level security/);assert.equal((migration.match(/public\.is_active_admin\(\)/g)??[]).length>=4,true);assert.doesNotMatch(migration,/\bto anon\b/);});
test("input and hashtag limits exist",()=>{assert.match(migration,/12000/);assert.match(source,/maxItems:8/);});
