import { NextResponse } from "next/server";
import { sessionCookieName } from "@/lib/session";
import { hasSupabaseEnv, supabaseAuthRequest } from "@/lib/supabase";

export async function GET(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((entry) => entry.startsWith(`${sessionCookieName}=`))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const result = await supabaseAuthRequest("user", { method: "GET", accessToken: token });

  if (!result.ok) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user: result.data });
}
