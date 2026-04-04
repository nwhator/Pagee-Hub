import { NextResponse } from "next/server";
import { validateBusiness } from "@/lib/validation";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";
import { getFeatureLimitsForUser, resolveUserIdFromRequest } from "@/lib/subscription";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const parsed = validateBusiness(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const userId = await resolveUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const limits = await getFeatureLimitsForUser(userId);
  const payload = parsed.data;

  const existingPageResult = await supabaseRest("BusinessPages", {
    method: "GET",
    useServiceRole: true,
    query: `select=id&user_id=eq.${userId}&limit=1`
  });

  const existingPageId = existingPageResult.data?.[0]?.id as string | undefined;

  if (existingPageId) {
    const updateResult = await supabaseRest("BusinessPages", {
      method: "PATCH",
      useServiceRole: true,
      query: `id=eq.${existingPageId}`,
      body: {
        ...payload,
        custom_domain: payload.custom_domain || null,
        show_branding: limits.canRemoveBranding ? payload.show_branding : true,
        logo_url: payload.logo_url || null,
        updated_at: new Date().toISOString()
      }
    });

    if (!updateResult.ok) {
      return NextResponse.json({ error: updateResult.data }, { status: updateResult.status });
    }

    return NextResponse.json(updateResult.data?.[0] ?? updateResult.data);
  }

  const pageCountResult = await supabaseRest("BusinessPages", {
    method: "GET",
    useServiceRole: true,
    query: `select=id&user_id=eq.${userId}`
  });

  const pageCount = Array.isArray(pageCountResult.data) ? pageCountResult.data.length : 0;
  if (pageCount >= limits.maxBusinessPages) {
    return NextResponse.json({ error: "Plan limit reached: only 1 business page is allowed." }, { status: 403 });
  }

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
    method: "POST",
    useServiceRole: true,
    body: {
      user_id: userId,
      ...payload,
      custom_domain: payload.custom_domain || null,
      services: payload.services,
      show_branding: limits.canRemoveBranding ? payload.show_branding : true,
      logo_url: payload.logo_url || null
    }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json(result.data?.[0] ?? result.data, { status: 201 });
}
