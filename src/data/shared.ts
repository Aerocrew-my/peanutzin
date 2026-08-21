export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function shouldUseDevelopmentFallback() {
  return process.env.NODE_ENV !== "production" && !isSupabaseConfigured();
}

export function requireConfiguredDataSource() {
  if (!isSupabaseConfigured() && process.env.NODE_ENV === "production") {
    throw new Error("Supabase is not configured for production.");
  }
}
