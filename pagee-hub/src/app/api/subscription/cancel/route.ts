import { NextResponse } from "next/server";
import { validateSubscriptionCancel } from "../../../../lib/validation";
import { hasSupabaseEnv, supabaseRest } from "../../../../lib/supabase";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const parsed = validateSubscriptionCancel(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { id } = parsed.data;

  // Stripe cancellation call should be implemented here when live API keys are provided.

  const result = await supabaseRest("Subscriptions", {
    method: "PATCH",
    useServiceRole: true,
    query: `id=eq.${id}`,
    body: { status: "canceled", updated_at: new Date().toISOString() }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json(result.data?.[0] ?? result.data);
}
