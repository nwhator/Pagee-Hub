export default function BillingPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Billing</h1>
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Payment History</h2>
        <p className="mt-2 text-slate-600">No invoices yet.</p>
      </section>
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Renewal</h2>
        <p className="mt-2 text-slate-600">Next renewal date: Placeholder</p>
      </section>
    </main>
  );
}
