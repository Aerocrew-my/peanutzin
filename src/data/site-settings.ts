import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "./shared";
import { unstable_cache } from "next/cache";

export type SiteSettings = { announcement?: string; newsletterHeading?: string; newsletterCopy?: string };
const querySiteSettings = unstable_cache(async (): Promise<SiteSettings> => {
  const result = await createPublicClient().from("site_settings").select("key,value");
  const data = result.data as Array<{ key: string; value: unknown }> | null;
  const error = result.error;
  if (error) throw new Error(`Unable to load site settings: ${error.message}`);
  return Object.fromEntries((data ?? []).map((item) => [item.key, item.value])) as SiteSettings;
}, ["public-site-settings"], { revalidate: 900, tags: ["site-settings"] });

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return {};
  return querySiteSettings();
}
