export default function SupportPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Help & Support</h1>
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">FAQ</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
          <li>How do I publish my page?</li>
          <li>How do I connect Stripe billing?</li>
          <li>How do I track click sources?</li>
        </ul>
      </section>
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Contact Support</h2>
        <textarea className="mt-3 w-full rounded-xl bg-slate-100 px-4 py-3" rows={4} placeholder="Tell us what you need help with" />
      </section>
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Chatbot (Optional Placeholder)</h2>
        <p className="mt-2 text-slate-600">Future AI assistant integration point.</p>
      </section>
    </main>
  );
}
