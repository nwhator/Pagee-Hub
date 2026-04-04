import { NextResponse } from "next/server";
import { hasSupabaseEnv, supabaseAuthRequest } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const payload = await request.json();
  const accessToken = typeof payload?.access_token === "string" ? payload.access_token : "";
  const password = typeof payload?.password === "string" ? payload.password : "";

  if (!accessToken) {
    return NextResponse.json({ error: "access_token is required" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const result = await supabaseAuthRequest("user", {
    method: "PUT",
    accessToken,
    body: { password }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json({ message: "Password updated" });
}
