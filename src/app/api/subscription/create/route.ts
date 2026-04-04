import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { validateSubscription } from "@/lib/validation";
import { getStripe, hasStripe, stripeConfig } from "@/lib/stripe";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";
import { FIRST_PRO_MIN_MONTHS, getLocalizedPricingUsd, resolveCountryFromRequest, usdToCents } from "@/lib/pricing";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const parsed = validateSubscription(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { user_id, billing_cycle, email, billing_country } = parsed.data;

  if (!hasStripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  }

  const countryCode = resolveCountryFromRequest(request, billing_country);
  const localizedPricing = getLocalizedPricingUsd(countryCode);

  const previousSubscriptions = await supabaseRest("Subscriptions", {
    method: "GET",
    useServiceRole: true,
    query: `select=id,plan&user_id=eq.${user_id}`
  });

  const hasPriorPro = Array.isArray(previousSubscriptions.data)
    ? previousSubscriptions.data.some((sub) => sub.plan === "pro")
    : false;

  const existingSubscription = await supabaseRest("Subscriptions", {
    method: "GET",
    useServiceRole: true,
    query: `select=id,stripe_customer_id&user_id=eq.${user_id}&order=created_at.desc&limit=1`
  });

  const existingCustomerId = existingSubscription.data?.[0]?.stripe_customer_id as string | undefined;
  let customerId = existingCustomerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: email || undefined,
      metadata: { user_id }
    });
    customerId = customer.id;
  }

  const useConfiguredPrice = localizedPricing.multiplier === 1;
  const priceId =
    billing_cycle === "monthly" ? stripeConfig.proMonthlyPriceId : stripeConfig.proYearlyPriceId;

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    useConfiguredPrice && priceId
      ? { price: priceId, quantity: 1 }
      : {
          price_data: {
            currency: "usd",
            recurring: { interval: billing_cycle === "monthly" ? "month" : "year" },
            unit_amount: usdToCents(billing_cycle === "monthly" ? localizedPricing.monthly : localizedPricing.yearly),
            product_data: {
              name: billing_cycle === "monthly" ? "Pagee Hub Pro Monthly" : "Pagee Hub Pro Yearly"
            }
          },
          quantity: 1
        }
  ];

  const isFirstMonthlyPurchase = billing_cycle === "monthly" && !hasPriorPro;
  const minimumUpfrontCents = usdToCents(localizedPricing.monthly * FIRST_PRO_MIN_MONTHS);
  const monthlyCents = usdToCents(localizedPricing.monthly);
  const additionalFirstInvoiceAmount = Math.max(minimumUpfrontCents - monthlyCents, 0);

  if (isFirstMonthlyPurchase && additionalFirstInvoiceAmount > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        unit_amount: additionalFirstInvoiceAmount,
        product_data: {
          name: "Pagee Hub Pro minimum 3-month upfront adjustment"
        }
      },
      quantity: 1
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: lineItems,
    success_url: `${stripeConfig.siteUrl}/billing?checkout=success`,
    cancel_url: `${stripeConfig.siteUrl}/plans?checkout=cancelled`,
    metadata: {
      user_id,
      plan: "pro",
      billing_cycle,
      country_code: countryCode,
      first_time_subscription: String(!hasPriorPro)
    },
    subscription_data: {
      metadata: { user_id, billing_cycle }
    }
  });

  return NextResponse.json({
    checkoutUrl: session.url,
    localizedPricing,
    minimumUpfrontChargeUsd: isFirstMonthlyPurchase ? localizedPricing.firstProMinimumCharge : localizedPricing.monthly,
    message: isFirstMonthlyPurchase
      ? "First Pro monthly purchase requires at least 3 months upfront."
      : "Checkout created."
  });
}
