import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center">
      <div className="space-y-6">
        <p className="inline-block rounded-full bg-green-100 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-green-700">
          pageehub.org
        </p>
        <h1 className="text-5xl font-black leading-[0.9] tracking-tight sm:text-7xl">
          Your business page in <span className="text-green-500">30 seconds</span>
        </h1>
        <p className="max-w-lg text-lg text-slate-600">
          Build a polished one-page profile with contacts, gallery, reviews, and analytics. Publish instantly to your own subdomain.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/signup" className="green-btn px-6 py-3">Sign Up</Link>
          <Link href="/login" className="rounded-full border border-black/10 bg-white px-6 py-3 font-semibold hover:bg-slate-50">Login</Link>
        </div>
      </div>
      <div className="surface-card grid gap-4 p-5">
        <div className="rounded-2xl bg-linear-to-r from-slate-900 to-slate-700 p-6 text-white">
          <p className="text-xl font-bold">The Artisan Loft</p>
          <p className="text-sm text-white/80">Handcrafted with soul</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <button className="rounded-xl bg-green-500 px-4 py-3 font-semibold text-green-950">WhatsApp</button>
          <button className="rounded-xl bg-slate-950 px-4 py-3 font-semibold text-white">Call</button>
        </div>
      </div>
    </section>
  );
}
