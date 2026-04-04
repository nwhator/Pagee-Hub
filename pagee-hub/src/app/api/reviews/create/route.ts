import { NextResponse } from "next/server";
import { validateReview } from "../../../../lib/validation";
import { hasSupabaseEnv, supabaseRest } from "../../../../lib/supabase";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const parsed = validateReview(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
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
