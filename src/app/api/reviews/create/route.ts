import { NextResponse } from "next/server";
import { validateReview } from "@/lib/validation";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";
import { getFeatureLimitsForUser } from "@/lib/subscription";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const parsed = validateReview(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const businessResult = await supabaseRest("BusinessPages", {
    method: "GET",
    useServiceRole: true,
    query: `select=id,user_id&id=eq.${parsed.data.business_id}&limit=1`
  });
  const business = businessResult.data?.[0];

  if (!business?.user_id) {
    return NextResponse.json({ error: "Business page not found" }, { status: 404 });
  }

  const limits = await getFeatureLimitsForUser(business.user_id);
  const reviewCountResult = await supabaseRest("Reviews", {
    method: "GET",
    useServiceRole: true,
    query: `select=id&business_id=eq.${parsed.data.business_id}`
  });
  const reviewCount = Array.isArray(reviewCountResult.data) ? reviewCountResult.data.length : 0;

  if (reviewCount >= limits.maxReviews) {
    return NextResponse.json({ error: `Plan limit reached: max ${limits.maxReviews} reviews on Free.` }, { status: 403 });
  }

  const result = await supabaseRest("Reviews", {
    method: "POST",
    useServiceRole: true,
    body: parsed.data
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json(result.data?.[0] ?? result.data, { status: 201 });
}
