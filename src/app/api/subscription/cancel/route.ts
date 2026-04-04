import { NextResponse } from "next/server";
import { validateSubscriptionCancel } from "@/lib/validation";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";
import { getStripe, hasStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  if (!hasStripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const parsed = validateSubscriptionCancel(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const current = await supabaseRest("Subscriptions", {
    method: "GET",
    useServiceRole: true,
    query: `select=id,stripe_subscription_id&id=eq.${parsed.data.id}&limit=1`
  });
  const currentSubscription = current.data?.[0];

  if (!currentSubscription) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  if (!currentSubscription.stripe_subscription_id) {
    return NextResponse.json({ error: "No Stripe subscription linked" }, { status: 400 });
  }

  const stripeSubscription = await stripe.subscriptions.update(currentSubscription.stripe_subscription_id, {
    cancel_at_period_end: true
  });

  const result = await supabaseRest("Subscriptions", {
    method: "PATCH",
    useServiceRole: true,
    query: `id=eq.${parsed.data.id}`,
    body: {
      status: "canceled",
      current_period_end: stripeSubscription.cancel_at
        ? new Date(stripeSubscription.cancel_at * 1000).toISOString()
        : null
    }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json({ message: "Subscription cancellation scheduled", subscription: result.data?.[0] ?? result.data });
}
