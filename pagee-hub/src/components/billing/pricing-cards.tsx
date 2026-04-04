type Plan = { name: string; price: string; perks: string[]; cta: string };

const plans: Plan[] = [
  { name: "Free", price: "$0", perks: ["1 business page", "Basic analytics", "Community support"], cta: "Current plan" },
  { name: "Pro", price: "$19/mo", perks: ["Unlimited media", "Advanced analytics", "Custom templates"], cta: "Upgrade" },
  { name: "Enterprise", price: "$79/mo", perks: ["Multi-brand workspace", "Priority support", "Custom domains"], cta: "Contact sales" }
];

export function PricingCards() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {plans.map((plan) => (
        <article key={plan.name} className="surface-card p-6">
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">{plan.name}</p>
          <p className="mt-2 text-4xl font-black">{plan.price}</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {plan.perks.map((perk) => (
              <li key={perk}>• {perk}</li>
            ))}
          </ul>
          <button className="green-btn mt-6 w-full px-4 py-3">{plan.cta}</button>
        </article>
      ))}
    </section>
  );
}
