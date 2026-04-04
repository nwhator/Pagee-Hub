"use client";

import { useEffect, useMemo, useState } from "react";

type PricingResponse = {
  localized: {
    countryCode: string;
    monthly: number;
    yearly: number;
    firstProMinimumCharge: number;
    multiplier: number;
  };
};

const freeFeatures = [
  "1 business page (subdomain only)",
  "Basic profile (business name, about, contact buttons)",
  "Up to 3 gallery images",
  "Basic services list",
  "Maximum 3 reviews",
  "Basic analytics (total clicks only)",
  "Pagee Hub branding visible"
];

const proFeatures = [
  "Custom domain support",
  "Remove Pagee Hub branding",
  "Unlimited links and services",
  "Up to 10 gallery images",
  "Unlimited reviews",
  "Advanced analytics by channel + daily/weekly",
  "Priority page performance",
  "Access to future Pro-only features"
];

export function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [country, setCountry] = useState("US");
  const [pricing, setPricing] = useState<PricingResponse | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function fetchPricing() {
      const res = await fetch(`/api/subscription/pricing?country=${encodeURIComponent(country)}`);
      const data = (await res.json()) as PricingResponse;
      setPricing(data);
    }
    void fetchPricing();
  }, [country]);

  const localizedCyclePrice = useMemo(() => {
    if (!pricing) return billingCycle === "monthly" ? 10 : 100;
    return billingCycle === "monthly" ? pricing.localized.monthly : pricing.localized.yearly;
  }, [billingCycle, pricing]);

  async function startCheckout() {
    if (!userId) {
      setMessage("Enter your user UUID to start checkout.");
      return;
    }

    setCheckoutLoading(true);
    setMessage("");

    const res = await fetch("/api/subscription/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        plan: "pro",
        billing_cycle: billingCycle,
        email,
        billing_country: country
      })
    });

    const data = await res.json();
    setCheckoutLoading(false);

    if (!res.ok) {
      setMessage(data?.error || "Unable to create checkout session");
      return;
    }

    if (typeof data?.checkoutUrl === "string") {
      window.location.href = data.checkoutUrl;
      return;
    }

    setMessage("Checkout session created.");
  }

  return (
    <section className="space-y-6">
      <div className="surface-card p-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Pricing in USD</p>
        <h2 className="mt-2 text-3xl font-black tracking-tight">Free or Pro. Nothing in-between.</h2>
        <p className="mt-2 text-sm text-slate-600">
          Pro is $10/month or $100/year. First monthly Pro purchase requires at least 3 months upfront because custom domain setup is included.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="surface-card p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Free</p>
          <p className="mt-2 text-4xl font-black">$0</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {freeFeatures.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
        </article>

        <article className="surface-card relative border-2 border-emerald-400 p-6">
          <span className="absolute -top-3 right-4 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">Recommended</span>
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Pro</p>
          <p className="mt-2 text-4xl font-black">${localizedCyclePrice.toFixed(2)}{billingCycle === "monthly" ? "/mo" : "/yr"}</p>
          <p className="mt-1 text-xs text-slate-500">Base USD reference: ${billingCycle === "monthly" ? "10.00" : "100.00"}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {proFeatures.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">
            Minimum 3-month payment required for first monthly Pro purchase.
          </p>
        </article>
      </div>

      <div className="surface-card grid gap-4 p-6 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          Billing cycle
          <select value={billingCycle} onChange={(event) => setBillingCycle(event.target.value as "monthly" | "yearly")} className="w-full rounded-xl bg-slate-100 px-3 py-3">
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>

        <label className="space-y-2 text-sm font-semibold text-slate-700">
          Country (optional regional pricing)
          <input
            value={country}
            onChange={(event) => setCountry(event.target.value.toUpperCase().slice(0, 2))}
            className="w-full rounded-xl bg-slate-100 px-3 py-3"
            placeholder="US"
            maxLength={2}
          />
        </label>

        <label className="space-y-2 text-sm font-semibold text-slate-700">
          User ID (UUID)
          <input value={userId} onChange={(event) => setUserId(event.target.value)} className="w-full rounded-xl bg-slate-100 px-3 py-3" placeholder="Required for checkout" />
        </label>

        <label className="space-y-2 text-sm font-semibold text-slate-700">
          Email (optional)
          <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl bg-slate-100 px-3 py-3" placeholder="you@business.com" />
        </label>

        <button onClick={startCheckout} disabled={checkoutLoading} className="green-btn md:col-span-2 px-4 py-3 disabled:opacity-50">
          {checkoutLoading ? "Creating checkout..." : "Upgrade to Pro"}
        </button>

        {message ? <p className="md:col-span-2 text-sm text-slate-700">{message}</p> : null}
      </div>
    </section>
  );
}
