import { NextResponse } from "next/server";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";

const subdomainRegex = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/;

export async function GET(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const subdomain = (url.searchParams.get("subdomain") || "").toLowerCase().trim();

  if (!subdomainRegex.test(subdomain)) {
    return NextResponse.json({ available: false, error: "Use 3-32 chars: letters, numbers, hyphens." }, { status: 400 });
  }

  const result = await supabaseRest("BusinessPages", {
    method: "GET",
    useServiceRole: true,
    query: `select=id&subdomain=eq.${encodeURIComponent(subdomain)}&limit=1`
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  const available = !(Array.isArray(result.data) && result.data.length > 0);
  return NextResponse.json({ available, subdomain });
}
