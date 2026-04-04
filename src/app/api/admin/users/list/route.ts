import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/admin";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";

export async function GET(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const result = await supabaseRest("Users", {
    method: "GET",
    useServiceRole: true,
    query: "select=id,email,created_at,status&order=created_at.desc"
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json({ users: result.data ?? [] });
}
