const cards = [
  { name: "Joe's Coffee", type: "Roastery & Espresso Bar" },
  { name: "Sarah's Studio", type: "Visual Arts & Photography" },
  { name: "Urban Greens", type: "Sustainable Plant Boutique" }
];

export function SamplePreviews() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="text-3xl font-black sm:text-4xl">Built with Pagee Hub</h2>
        <span className="text-sm font-semibold text-green-700">Live templates</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article key={card.name} className="surface-card p-5">
            <div className="mb-4 h-40 rounded-xl bg-linear-to-br from-slate-200 to-slate-100" />
            <h3 className="text-xl font-bold">{card.name}</h3>
            <p className="text-slate-600">{card.type}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
