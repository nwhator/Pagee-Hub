import { NextResponse } from "next/server";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";

export async function GET(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const subdomain = (url.searchParams.get("subdomain") || "").toLowerCase().trim();

  if (!subdomain) {
    return NextResponse.json({ error: "subdomain is required" }, { status: 400 });
  }

  const result = await supabaseRest("BusinessPages", {
    method: "GET",
    query: `subdomain=eq.${encodeURIComponent(subdomain)}&limit=1`
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json({ page: result.data?.[0] ?? null });
}
