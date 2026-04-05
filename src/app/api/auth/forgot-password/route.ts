import { NextResponse } from "next/server";
import { hasSupabaseEnv, supabaseAuthRequest } from "@/lib/supabase";

function getAuthErrorMessage(error: unknown) {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    const candidate = error as { message?: unknown; msg?: unknown; error_description?: unknown };
    if (typeof candidate.message === "string") return candidate.message;
    if (typeof candidate.msg === "string") return candidate.msg;
    if (typeof candidate.error_description === "string") return candidate.error_description;
  }

  return "Unable to send reset link right now.";
}

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
    return NextResponse.json({ error: getAuthErrorMessage(result.data) }, { status: result.status });
  }

  return NextResponse.json({ message: "Reset link sent" });
}
