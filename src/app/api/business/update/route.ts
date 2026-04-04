import { NextResponse } from "next/server";
import { validateBusiness } from "@/lib/validation";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";
import { getFeatureLimitsForUser, parseUserIdFromRequest } from "@/lib/subscription";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const parsed = validateBusiness(await request.json(), true);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const userId = parseUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Missing x-user-id header" }, { status: 400 });
  }
  const limits = await getFeatureLimitsForUser(userId);
  const { id, ...payload } = parsed.data;

  if (payload.media_urls.length > limits.maxGalleryImages) {
    return NextResponse.json({ error: `Plan limit reached: max ${limits.maxGalleryImages} gallery images.` }, { status: 403 });
  }

  if (payload.services.length > limits.maxServices) {
    return NextResponse.json({ error: "Plan limit reached: upgrade to Pro for unlimited services." }, { status: 403 });
  }

  if (payload.custom_domain && !limits.canUseCustomDomain) {
    return NextResponse.json({ error: "Custom domains require Pro." }, { status: 403 });
  }

  if (payload.show_branding === false && !limits.canRemoveBranding) {
    return NextResponse.json({ error: "Branding removal requires Pro." }, { status: 403 });
  }

  const result = await supabaseRest("BusinessPages", {
    method: "PATCH",
    useServiceRole: true,
    query: `id=eq.${id}`,
    body: {
      ...payload,
      custom_domain: payload.custom_domain || null,
      show_branding: limits.canRemoveBranding ? payload.show_branding : true,
      updated_at: new Date().toISOString()
    }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json(result.data?.[0] ?? result.data);
}
