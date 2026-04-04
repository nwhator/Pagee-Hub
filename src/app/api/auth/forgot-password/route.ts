import { NextResponse } from "next/server";
import { hasSupabaseEnv, supabaseAuthRequest } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const payload = await request.json();
  const email = typeof payload?.email === "string" ? payload.email.trim() : "";

  if (!email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/reset-password`;
  const result = await supabaseAuthRequest("recover", {
    method: "POST",
    body: { email, redirect_to: redirectTo }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json({ message: "Reset link sent" });
}
