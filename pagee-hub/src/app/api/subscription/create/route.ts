import { NextResponse } from "next/server";
import { validateSubscription } from "../../../../lib/validation";
import { hasStripe, stripeConfig } from "../../../../lib/stripe";
import { hasSupabaseEnv, supabaseRest } from "../../../../lib/supabase";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const parsed = validateSubscription(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { user_id, plan_type } = parsed.data;

  if (!hasStripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const priceId =
    plan_type === "pro" ? stripeConfig.proPriceId : plan_type === "enterprise" ? stripeConfig.enterprisePriceId : undefined;

  if (!priceId) {
    return NextResponse.json({ error: "Missing Stripe price id" }, { status: 400 });
  }

  const stripeSubscriptionId = `sub_placeholder_${Date.now()}`;

  const result = await supabaseRest("Subscriptions", {
    method: "POST",
    useServiceRole: true,
    body: {
      user_id,
      plan_type,
      status: "active",
      stripe_id: stripeSubscriptionId
    }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json(result.data?.[0] ?? result.data, { status: 201 });
}
