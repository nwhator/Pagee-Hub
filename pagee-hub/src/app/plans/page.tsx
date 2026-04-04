import { PricingCards } from "@/components/billing/pricing-cards";

export default function PlansPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-4xl font-black tracking-tight">Subscription Plans</h1>
      <PricingCards />
    </main>
  );
}
