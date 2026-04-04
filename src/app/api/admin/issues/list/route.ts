import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/admin";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";

export async function GET(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const result = await supabaseRest("Issues", {
    method: "GET",
    useServiceRole: true,
    query: "select=id,title,description,status,priority,created_at&order=created_at.desc"
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json({ issues: result.data ?? [] });
}
