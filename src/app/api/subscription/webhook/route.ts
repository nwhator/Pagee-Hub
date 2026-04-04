import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, stripeConfig } from "@/lib/stripe";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";

function mapStripeStatus(status: string): "active" | "canceled" | "past_due" {
  if (status === "past_due" || status === "unpaid") return "past_due";
  if (status === "canceled" || status === "incomplete_expired") return "canceled";
  return "active";
}

async function upsertSubscriptionForUser(payload: {
  userId: string;
  plan: "free" | "pro";
  billingCycle: "monthly" | "yearly";
  status: "active" | "canceled" | "past_due";
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  currentPeriodEnd: string | null;
  countryCode?: string;
}) {
  const existing = await supabaseRest("Subscriptions", {
    method: "GET",
    useServiceRole: true,
    query: `select=id&user_id=eq.${payload.userId}&order=created_at.desc&limit=1`
  });

  const body = {
    user_id: payload.userId,
    plan: payload.plan,
    billing_cycle: payload.billingCycle,
    status: payload.status,
    stripe_customer_id: payload.stripeCustomerId,
    stripe_subscription_id: payload.stripeSubscriptionId,
    current_period_end: payload.currentPeriodEnd
  };

  if (existing.data?.[0]?.id) {
    return supabaseRest("Subscriptions", {
      method: "PATCH",
      useServiceRole: true,
      query: `id=eq.${existing.data[0].id}`,
      body
    });
  }

  return supabaseRest("Subscriptions", {
    method: "POST",
    useServiceRole: true,
    body
  });
}

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe || !stripeConfig.webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const body = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeConfig.webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid Stripe signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (session.customer && userId) {
      await upsertSubscriptionForUser({
        userId,
        plan: "pro",
        billingCycle: session.metadata?.billing_cycle === "yearly" ? "yearly" : "monthly",
        status: "active",
        stripeCustomerId: typeof session.customer === "string" ? session.customer : session.customer.id,
        stripeSubscriptionId: typeof session.subscription === "string" ? session.subscription : session.subscription?.id || null,
        currentPeriodEnd: null,
        countryCode: session.metadata?.country_code
      });

      if (session.metadata?.country_code) {
        await supabaseRest("Users", {
          method: "PATCH",
          useServiceRole: true,
          query: `id=eq.${userId}`,
          body: {
            country_code: session.metadata.country_code
          }
        });
      }
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = subscription.metadata?.user_id;
    if (userId) {
      const periodEnd = subscription.cancel_at
        ? new Date(subscription.cancel_at * 1000).toISOString()
        : null;

      await upsertSubscriptionForUser({
        userId,
        plan: subscription.cancel_at_period_end ? "pro" : "pro",
        billingCycle: subscription.items.data[0]?.price.recurring?.interval === "year" ? "yearly" : "monthly",
        status: mapStripeStatus(subscription.status),
        stripeCustomerId: typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id,
        stripeSubscriptionId: subscription.id,
        currentPeriodEnd: periodEnd
      });
    }
  }

  return NextResponse.json({ received: true });
}
