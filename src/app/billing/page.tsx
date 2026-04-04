import { WorkspaceShell } from "@/components/shared/workspace-shell";

export default function BillingPage() {
  return (
    <WorkspaceShell title="Billing">
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Payment History</h2>
        <p className="mt-2 text-slate-600">No invoices yet.</p>
      </section>
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Renewal</h2>
        <p className="mt-2 text-slate-600">Next renewal date: Placeholder</p>
      </section>
    </WorkspaceShell>
  );
}
