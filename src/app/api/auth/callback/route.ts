import { NextResponse } from "next/server";
import { hasSupabaseEnv, supabaseAuthRequest } from "@/lib/supabase";
import { withAuthCookies } from "@/lib/session";
import { ensureUserProfile } from "@/lib/user-profile";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const payload = await request.json();
  const accessToken = typeof payload?.access_token === "string" ? payload.access_token : "";
  const refreshToken = typeof payload?.refresh_token === "string" ? payload.refresh_token : "";
  const expiresIn = typeof payload?.expires_in === "number" ? payload.expires_in : 3600;

  if (!accessToken) {
    return NextResponse.json({ error: "access_token is required" }, { status: 400 });
  }

  // Verify the token and get user info from Supabase.
  const userResult = await supabaseAuthRequest("user", { method: "GET", accessToken });
  if (!userResult.ok) {
    return NextResponse.json({ error: "Invalid or expired confirmation token" }, { status: 401 });
  }

  const user = userResult.data as { id?: string; email?: string } | null;

  if (user?.id && user?.email) {
    await ensureUserProfile({ id: user.id, email: user.email });
  }

  const response = NextResponse.json({ message: "Session established", user });

  return withAuthCookies(response, {
    access_token: accessToken,
    refresh_token: refreshToken ?? undefined,
    expires_in: expiresIn,
    user: user ?? undefined,
  });
}
