import { NextResponse, type NextRequest } from "next/server";
import { sessionCookieName } from "@/lib/session";
import { hasSupabaseEnv, supabaseAuthRequest } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const token = request.cookies?.get(sessionCookieName)?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const result = await supabaseAuthRequest("user", { method: "GET", accessToken: token });

  if (!result.ok) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, user: result.data });
}
