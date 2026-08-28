import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
const root=new URL("..",import.meta.url),site=await readFile(new URL("src/components/site.tsx",root),"utf8"),editors=await readFile(new URL("src/components/admin/editors.tsx",root),"utf8"),field=await readFile(new URL("src/components/admin/media-field.tsx",root),"utf8"),actions=await readFile(new URL("src/app/admin/actions.ts",root),"utf8"),art=await readdir(new URL("supabase/assets/article-media/editorial/real-content-2026/",root));
test("footer exposes discreet staff access without changing customer login",()=>{assert.match(site,/footer-secondary[^>]+href="\/admin\/login"/);assert.match(site,/signedIn\?"\/account":"\/login"/)});
test("admin media controls preview replace and confirm removal",()=>{assert.match(editors,/MediaField/);assert.match(field,/Current \{label\}/);assert.match(field,/Replace \$\{label\}/);assert.match(field,/confirm\(/);assert.match(actions,/remove_image/)});
test("all nineteen generated editorial assets are committed",()=>{assert.equal(art.filter(x=>x.endsWith(".webp")).length,19)});
