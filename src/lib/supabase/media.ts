export function publicMediaUrl(bucket: "article-media" | "book-covers", value: string | null) {
  if (value?.startsWith("https://")) return value;
  if (!value || !value.includes("/")) return value;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return base ? `${base}/storage/v1/object/public/${bucket}/${value.split("/").map(encodeURIComponent).join("/")}` : value;
}
