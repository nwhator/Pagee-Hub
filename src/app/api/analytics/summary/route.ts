import { NextResponse } from "next/server";
import { getFeatureLimitsForUser } from "@/lib/subscription";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";

export async function GET(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  const businessId = url.searchParams.get("business_id") || "";

  if (!businessId) {
    return NextResponse.json({ error: "business_id is required" }, { status: 400 });
  }

  const businessResult = await supabaseRest("BusinessPages", {
    method: "GET",
    useServiceRole: true,
    query: `select=id,user_id&id=eq.${businessId}&limit=1`
  });
  const business = businessResult.data?.[0];

  if (!business?.user_id) {
    return NextResponse.json({ error: "Business page not found" }, { status: 404 });
  }

  const limits = await getFeatureLimitsForUser(business.user_id);

  const allEvents = await supabaseRest("Analytics", {
    method: "GET",
    useServiceRole: true,
    query: `select=id,source,created_at&business_id=eq.${businessId}`
  });

  if (!allEvents.ok) {
    return NextResponse.json({ error: allEvents.data }, { status: allEvents.status });
  }

  const events = Array.isArray(allEvents.data) ? allEvents.data : [];
  const totalClicks = events.length;

  if (!limits.hasAdvancedAnalytics) {
    return NextResponse.json({
      plan: "free",
      totalClicks,
      message: "Upgrade to Pro to view channel and daily/weekly analytics."
    });
  }

  const channels: Record<string, number> = {};
  const daily: Record<string, number> = {};
  const weekly: Record<string, number> = {};

  for (const event of events) {
    const source = typeof event.source === "string" ? event.source : "direct";
    channels[source] = (channels[source] || 0) + 1;

    const date = new Date(event.created_at);
    const dayKey = date.toISOString().slice(0, 10);
    daily[dayKey] = (daily[dayKey] || 0) + 1;

    const weekStart = new Date(date);
    const weekday = weekStart.getUTCDay();
    const diff = weekday === 0 ? 6 : weekday - 1;
    weekStart.setUTCDate(weekStart.getUTCDate() - diff);
    const weekKey = weekStart.toISOString().slice(0, 10);
    weekly[weekKey] = (weekly[weekKey] || 0) + 1;
  }

  return NextResponse.json({
    plan: "pro",
    totalClicks,
    channels,
    daily,
    weekly
  });
}
