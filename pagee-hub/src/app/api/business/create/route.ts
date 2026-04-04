import { NextResponse } from "next/server";
import { validateBusiness } from "../../../../lib/validation";
import { hasSupabaseEnv, supabaseRest } from "../../../../lib/supabase";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const parsed = validateBusiness(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const payload = parsed.data;
  const result = await supabaseRest("BusinessPages", {
    method: "POST",
    useServiceRole: true,
    body: {
      user_id: "00000000-0000-0000-0000-000000000000",
      ...payload,
      services: payload.services,
      logo_url: payload.logo_url || null
    }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json(result.data?.[0] ?? result.data, { status: 201 });
}
