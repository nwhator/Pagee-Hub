import { NextResponse } from "next/server";
import { validateAuth } from "@/lib/validation";
import { hasSupabaseEnv, supabaseAuth } from "@/lib/supabase";
import { withAuthCookies } from "@/lib/session";

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

  return "Unable to create account right now. Please try again.";
}

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const parsed = validateAuth(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const result = await supabaseAuth("signup", { email, password });
  if (!result.ok) {
    return NextResponse.json({ error: getAuthErrorMessage(result.data) }, { status: result.status });
  }

  const hasSession = Boolean(result.data?.access_token);
  const message = hasSession
    ? "Signup successful"
    : "Account created. Check your email to verify your account before signing in.";

  const response = NextResponse.json({
    user: result.data?.user ?? null,
    message,
    requires_email_verification: !hasSession
  }, { status: 201 });

  return withAuthCookies(response, result.data ?? {});
}
