import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "./shared";

export type SiteSettings = { announcement?: string; newsletterHeading?: string; newsletterCopy?: string };
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return {};
  const result = await (await createClient()).from("site_settings").select("key,value");
  const data = result.data as Array<{ key: string; value: unknown }> | null;
  const error = result.error;
  if (error) throw new Error(`Unable to load site settings: ${error.message}`);
  return Object.fromEntries((data ?? []).map((item) => [item.key, item.value])) as SiteSettings;
}
