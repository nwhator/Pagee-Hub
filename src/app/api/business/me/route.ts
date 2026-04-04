import { NextResponse } from "next/server";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";
import { parseUserIdFromRequest } from "@/lib/subscription";

export async function GET(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const userId = parseUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Missing or invalid x-user-id header" }, { status: 400 });
  }

  const result = await supabaseRest("BusinessPages", {
    method: "GET",
    useServiceRole: true,
    query: `user_id=eq.${userId}&order=created_at.desc&limit=1`
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json({ page: result.data?.[0] ?? null });
}
