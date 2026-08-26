import { AdminShell, DataError, Notice } from "@/components/admin/shell";
import { SettingsEditor } from "@/components/admin/editors";
import { createClient } from "@/lib/supabase/server";

export default async function Page({searchParams}:{searchParams:Promise<Record<string,string|undefined>>}) {
  const q=await searchParams,{data,error}=await(await createClient()).from("site_settings").select("key,value");
  return <AdminShell section="Settings"><h1>Site settings</h1><Notice searchParams={q}/>{error ? <DataError message={`Site settings could not be loaded (${error.message}).`} /> : <SettingsEditor values={Object.fromEntries((data??[]).map(setting=>[setting.key,setting.value]))}/>}</AdminShell>;
}
