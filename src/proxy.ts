import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;
  const supabase = createServerClient(url, key, { cookies: {
    getAll: () => request.cookies.getAll(),
    setAll: (items) => { items.forEach(({ name, value }) => request.cookies.set(name, value)); response = NextResponse.next({ request }); items.forEach(({ name, value, options }) => response.cookies.set(name, value, options)); },
  }});
  const { data: { user } } = await supabase.auth.getUser();
  const login = request.nextUrl.pathname === "/admin/login";
  let authorized = false;
  if (user) {
    const { data } = await supabase.from("admin_users").select("active").eq("id", user.id).maybeSingle();
    authorized = data?.active === true;
  }
  if (!login && !authorized) return NextResponse.redirect(new URL("/admin/login", request.url));
  if (login && authorized) return NextResponse.redirect(new URL("/admin", request.url));
  return response;
}

export const config = { matcher: ["/admin/:path*"] };
