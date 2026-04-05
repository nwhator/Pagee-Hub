import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center">
      <div className="space-y-6">
        <p className="inline-block rounded-full border border-emerald-200/30 bg-emerald-200/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100">
          pageehub.org
        </p>
        <h1 className="text-5xl font-black leading-[0.9] tracking-tight text-emerald-50 sm:text-7xl">
          Your business page in <span className="text-emerald-300">30 seconds</span>
        </h1>
        <p className="max-w-lg text-lg text-emerald-100/85">
          Build a polished one-page profile with contacts, gallery, reviews, and analytics. Publish instantly to your own subdomain.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/signup" className="green-btn px-6 py-3">Sign Up</Link>
          <Link href="/login" className="rounded-full border border-emerald-200/25 bg-emerald-100/10 px-6 py-3 font-semibold text-emerald-50 hover:bg-emerald-100/20">Login</Link>
        </div>
      </div>
      <div className="surface-card grid gap-4 p-5">
        <div className="rounded-2xl border border-emerald-100/20 bg-linear-to-r from-emerald-700/70 to-teal-600/60 p-6 text-white">
          <p className="text-xl font-bold">The Artisan Loft</p>
          <p className="text-sm text-white/80">Handcrafted with soul</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <button className="rounded-xl bg-emerald-300 px-4 py-3 font-semibold text-emerald-950">WhatsApp</button>
          <button className="rounded-xl bg-emerald-100/10 px-4 py-3 font-semibold text-emerald-50 ring-1 ring-emerald-100/20">Call</button>
        </div>
      </div>
    </section>
  );
}
