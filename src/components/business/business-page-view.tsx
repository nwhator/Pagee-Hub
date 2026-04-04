import type { BusinessPage, Review } from "@/types/models";

export function BusinessPageView({ page, reviews }: { page: BusinessPage; reviews: Review[] }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <header className="rounded-3xl p-6 text-white" style={{ backgroundColor: page.brand_color || "#22C55E" }}>
        <h1 className="text-4xl font-black tracking-tight">{page.name}</h1>
        <p className="text-white/85">{page.tagline}</p>
      </header>

      <section className="mt-6 surface-card p-6">
        <h2 className="text-xl font-black">About</h2>
        <p className="mt-2 text-slate-700">{page.about}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a className="green-btn px-5 py-2" href={`https://wa.me/${page.whatsapp ?? ""}`}>WhatsApp</a>
          <a className="rounded-full bg-slate-950 px-5 py-2 font-semibold text-white" href={`tel:${page.phone ?? ""}`}>Call</a>
          <a className="rounded-full bg-slate-100 px-5 py-2 font-semibold" href={`https://instagram.com/${(page.instagram ?? "").replace("@", "")}`}>Instagram</a>
        </div>
      </section>

      <section className="mt-6 surface-card p-6">
        <h2 className="text-xl font-black">Services / Products</h2>
        <ul className="mt-3 space-y-2">
          {page.services.map((service) => (
            <li key={`${service.name}-${service.price}`} className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3">
              <span className="font-semibold">{service.name}</span>
              <span className="text-slate-600">{service.price}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 surface-card p-6">
        <h2 className="text-xl font-black">Gallery</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(page.media_urls.length ? page.media_urls : ["", "", ""]).map((url, index) => (
            <div key={`${url}-${index}`} className="h-28 rounded-xl bg-slate-200" style={url ? { backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined} />
          ))}
        </div>
      </section>

      <section className="mt-6 surface-card p-6">
        <h2 className="text-xl font-black">Reviews</h2>
        <div className="mt-3 space-y-3">
          {reviews.map((review) => (
            <article key={review.id} className="rounded-xl bg-slate-100 p-4">
              <p className="text-sm font-bold">{review.user_name} • {"★".repeat(review.rating)}</p>
              <p className="text-slate-700">{review.comment}</p>
            </article>
          ))}
        </div>
      </section>

      {page.show_branding ? (
        <p className="mt-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Built with Pagee Hub
        </p>
      ) : null}
    </main>
  );
}
