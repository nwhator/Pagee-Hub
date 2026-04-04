import { NextResponse } from "next/server";
import { validateAuth } from "@/lib/validation";
import { hasSupabaseEnv, supabaseAuth } from "@/lib/supabase";
import { withAuthCookies } from "@/lib/session";

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
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  const response = NextResponse.json({
    user: result.data?.user ?? null,
    message: "Signup successful"
  }, { status: 201 });

  return withAuthCookies(response, result.data ?? {});
}
