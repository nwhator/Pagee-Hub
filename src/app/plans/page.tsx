import { PricingCards } from "@/components/billing/pricing-cards";
import { WorkspaceShell } from "@/components/shared/workspace-shell";

export default function PlansPage() {
  return (
    <WorkspaceShell title="Subscription Plans">
      <PricingCards />
    </WorkspaceShell>
  );
}
