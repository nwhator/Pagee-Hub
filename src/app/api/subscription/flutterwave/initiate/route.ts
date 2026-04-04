import { NextResponse } from "next/server";
import { validateSubscription } from "@/lib/validation";
import { convertUsdToLocal, getLocalizedPricingUsd, resolveCountryFromRequest } from "@/lib/pricing";
import { flutterwaveConfig, flutterwaveInitializePayment, hasFlutterwave } from "@/lib/flutterwave";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";
import { resolveUserIdFromRequest } from "@/lib/subscription";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  if (!hasFlutterwave) {
    return NextResponse.json({ error: "Flutterwave is not configured" }, { status: 503 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const sessionUserId = await resolveUserIdFromRequest(request);

  if (!sessionUserId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  if (typeof body.user_id === "string" && body.user_id && body.user_id !== sessionUserId) {
    return NextResponse.json({ error: "user_id does not match authenticated user" }, { status: 403 });
  }

  body.user_id = sessionUserId;

  const parsed = validateSubscription(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const { user_id, billing_cycle, email, billing_country } = parsed.data;
  const countryCode = resolveCountryFromRequest(request, billing_country);
  const localizedPricingUsd = getLocalizedPricingUsd(countryCode);
  const usdAmount = billing_cycle === "monthly" ? localizedPricingUsd.monthly : localizedPricingUsd.yearly;
  const localPricing = convertUsdToLocal(usdAmount, countryCode);

  const txRef = `pagee_${user_id}_${Date.now()}`;

  const init = await flutterwaveInitializePayment({
    tx_ref: txRef,
    amount: localPricing.amount,
    currency: localPricing.currency,
    redirect_url: flutterwaveConfig.redirectUrl,
    customer: {
      email: email || "customer@pageehub.org"
    },
    customizations: {
      title: "Pagee Hub Pro",
      description: billing_cycle === "monthly" ? "Pro monthly subscription" : "Pro yearly subscription"
    },
    meta: {
      user_id,
      plan: "pro",
      billing_cycle,
      country_code: countryCode,
      provider: "flutterwave",
      usd_amount: usdAmount.toString()
    }
  });

  if (!init.ok || !init.data?.data?.link) {
    return NextResponse.json({ error: init.data || "Unable to initialize Flutterwave payment" }, { status: init.status || 400 });
  }

  await supabaseRest("Subscriptions", {
    method: "POST",
    useServiceRole: true,
    body: {
      user_id,
      plan: "pro",
      billing_cycle,
      provider: "flutterwave",
      provider_transaction_id: txRef,
      status: "past_due"
    }
  });

  return NextResponse.json({
    checkoutUrl: init.data.data.link,
    txRef,
    localPricing,
    usdAmount
  });
}
