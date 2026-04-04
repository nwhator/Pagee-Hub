import { NextResponse } from "next/server";
import { validateBusiness } from "../../../../lib/validation";
import { hasSupabaseEnv, supabaseRest } from "../../../../lib/supabase";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const parsed = validateBusiness(await request.json(), true);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { id, ...payload } = parsed.data;
  const result = await supabaseRest("BusinessPages", {
    method: "PATCH",
    useServiceRole: true,
    query: `id=eq.${id}`,
    body: { ...payload, updated_at: new Date().toISOString() }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json(result.data?.[0] ?? result.data);
}
