import { NextResponse } from "next/server";
import { validateSubscriptionUpdate } from "@/lib/validation";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";
import { getStripe, hasStripe, stripeConfig } from "@/lib/stripe";

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

  const parsed = validateSubscriptionUpdate(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const current = await supabaseRest("Subscriptions", {
    method: "GET",
    useServiceRole: true,
    query: `select=id,plan,billing_cycle,status,stripe_subscription_id,current_period_end&id=eq.${parsed.data.id}&limit=1`
  });

  const subscription = current.data?.[0];
  if (!subscription) {
    return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
  }

  if (parsed.data.plan === "free") {
    if (subscription.stripe_subscription_id) {
      const stripeSubscription = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
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
            : subscription.current_period_end
        }
      });

      if (!result.ok) {
        return NextResponse.json({ error: result.data }, { status: result.status });
      }

      return NextResponse.json({ message: "Downgrade scheduled for end of current billing cycle." });
    }

    const result = await supabaseRest("Subscriptions", {
      method: "PATCH",
      useServiceRole: true,
      query: `id=eq.${parsed.data.id}`,
      body: { plan: "free", status: "canceled", current_period_end: subscription.current_period_end }
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.data }, { status: result.status });
    }

    return NextResponse.json({ message: "Plan set to Free." });
  }

  if (!subscription.stripe_subscription_id) {
    return NextResponse.json({ error: "No Stripe subscription is attached to this record." }, { status: 400 });
  }

  const nextCycle = parsed.data.billing_cycle || subscription.billing_cycle;
  const targetPriceId = nextCycle === "monthly" ? stripeConfig.proMonthlyPriceId : stripeConfig.proYearlyPriceId;

  if (!targetPriceId) {
    return NextResponse.json({ error: "Missing Stripe price id for requested billing cycle." }, { status: 400 });
  }

  const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
  const currentItemId = stripeSubscription.items.data[0]?.id;

  if (!currentItemId) {
    return NextResponse.json({ error: "Unable to update Stripe subscription item." }, { status: 400 });
  }

  const updatedStripe = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
    cancel_at_period_end: false,
    items: [{ id: currentItemId, price: targetPriceId }],
    proration_behavior: "create_prorations"
  });

  const result = await supabaseRest("Subscriptions", {
    method: "PATCH",
    useServiceRole: true,
    query: `id=eq.${parsed.data.id}`,
    body: {
      plan: "pro",
      billing_cycle: nextCycle,
      status: updatedStripe.status === "past_due" ? "past_due" : "active",
      current_period_end: updatedStripe.cancel_at
        ? new Date(updatedStripe.cancel_at * 1000).toISOString()
        : subscription.current_period_end
    }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json({ message: "Subscription updated", subscription: result.data?.[0] ?? result.data });
}
