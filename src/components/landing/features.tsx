const features = [
  { title: "Contact Buttons", description: "WhatsApp, call, email, and social links optimized for mobile." },
  { title: "Reviews", description: "Collect testimonials, reply quickly, and highlight social proof." },
  { title: "Gallery", description: "Upload image and video media to showcase services and products." },
  { title: "Analytics", description: "Track clicks by source, social channel, and day/week trends." }
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-700">Features</p>
        <h2 className="mt-2 text-3xl font-black sm:text-4xl">Everything entrepreneurs need</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => (
          <article key={feature.title} className="surface-card p-6">
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="mt-2 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
