import { NextResponse } from "next/server";
import { flutterwaveConfig, flutterwaveVerifyTransaction } from "@/lib/flutterwave";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const hash = request.headers.get("verif-hash") || "";
  if (!flutterwaveConfig.webhookHash || hash !== flutterwaveConfig.webhookHash) {
    return NextResponse.json({ error: "Invalid Flutterwave webhook signature" }, { status: 401 });
  }

  const payload = await request.json();
  const txRef = typeof payload?.data?.tx_ref === "string" ? payload.data.tx_ref : "";
  const transactionId = payload?.data?.id ? String(payload.data.id) : "";

  if (!txRef || !transactionId) {
    return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
  }

  const verify = await flutterwaveVerifyTransaction(transactionId);
  if (!verify.ok || verify.data?.status !== "success") {
    return NextResponse.json({ error: "Flutterwave transaction verification failed" }, { status: 400 });
  }

  const userId = verify.data?.data?.meta?.user_id;
  const billingCycle = verify.data?.data?.meta?.billing_cycle === "yearly" ? "yearly" : "monthly";

  if (!userId) {
    return NextResponse.json({ error: "Missing user metadata" }, { status: 400 });
  }

  const existing = await supabaseRest("Subscriptions", {
    method: "GET",
    useServiceRole: true,
    query: `user_id=eq.${userId}&order=created_at.desc&limit=1`
  });

  const body = {
    user_id: userId,
    plan: "pro",
    billing_cycle: billingCycle,
    provider: "flutterwave",
    provider_transaction_id: txRef,
    status: "active"
  };

  if (existing.data?.[0]?.id) {
    await supabaseRest("Subscriptions", {
      method: "PATCH",
      useServiceRole: true,
      query: `id=eq.${existing.data[0].id}`,
      body
    });
  } else {
    await supabaseRest("Subscriptions", {
      method: "POST",
      useServiceRole: true,
      body
    });
  }

  return NextResponse.json({ received: true });
}
