import test from"node:test";import assert from"node:assert/strict";import{readFile}from"node:fs/promises";
const migration=await readFile(new URL("../supabase/migrations/202608280001_phase_9_marketplace_ebooks.sql",import.meta.url),"utf8"),article=await readFile(new URL("../src/lib/ai/article.ts",import.meta.url),"utf8"),actions=await readFile(new URL("../src/app/admin/social-studio/actions.ts",import.meta.url),"utf8"),cart=await readFile(new URL("../src/components/cart/cart-provider.tsx",import.meta.url),"utf8");
test("ebook-only orders have zero shipping",()=>{assert.match(migration,/if v_has_physical then[\s\S]*else v_shipping:=0/)});
test("mixed carts price each format and ship physical portion",()=>{assert.match(migration,/ebook_price_cents/);assert.match(migration,/bool_or\(coalesce\(x->>'format','physical'\)='physical'\)/)});
test("digital items never decrement physical stock",()=>{assert.match(migration,/oi\.format='physical'/)});
test("cart identity includes selected format",()=>{assert.match(cart,/x\.bookId===bookId&&x\.format===format/)});
test("article generation is structured and fact guarded",()=>{assert.match(article,/Never invent|fabricated quotes/);for(const key of["headline","excerpt","body","category","seoTitle","seoDescription","socialHook"])assert.match(article,new RegExp(key))});
test("generated articles persist to the normal CMS as drafts",()=>{assert.match(actions,/from\("articles"\)\.insert/);assert.match(actions,/status:"draft"/);assert.match(actions,/redirect\(`\/admin\/articles\//)});
