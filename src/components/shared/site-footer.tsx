import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-emerald-300/40 bg-[radial-gradient(110%_90%_at_10%_10%,rgba(16,185,129,0.18),transparent_55%),radial-gradient(80%_70%_at_90%_20%,rgba(20,184,166,0.16),transparent_50%),#02110b] text-emerald-50">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="text-2xl font-black tracking-tight">Pagee Hub</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-emerald-100/80">
              Turn one link into a complete business presence. Launch fast, track growth, and convert clicks into paying customers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup" className="rounded-full bg-emerald-400 px-5 py-2 text-sm font-bold text-emerald-950 transition hover:bg-emerald-300">
                Start Free
              </Link>
              <Link href="/template-library" className="rounded-full border border-emerald-200/40 px-5 py-2 text-sm font-bold text-emerald-50 transition hover:bg-emerald-100/10">
                View Templates
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-emerald-100/70">Product</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/template-library" className="text-emerald-50/85 transition hover:text-emerald-200">Templates</Link></li>
              <li><Link href="/plans" className="text-emerald-50/85 transition hover:text-emerald-200">Pricing</Link></li>
              <li><Link href="/analytics" className="text-emerald-50/85 transition hover:text-emerald-200">Analytics</Link></li>
              <li><Link href="/reviews" className="text-emerald-50/85 transition hover:text-emerald-200">Reviews</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-emerald-100/70">Company</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><Link href="/support" className="text-emerald-50/85 transition hover:text-emerald-200">Help Center</Link></li>
              <li><Link href="/login" className="text-emerald-50/85 transition hover:text-emerald-200">Log In</Link></li>
              <li><Link href="/signup" className="text-emerald-50/85 transition hover:text-emerald-200">Create Account</Link></li>
              <li><Link href="/dashboard" className="text-emerald-50/85 transition hover:text-emerald-200">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-emerald-100/70">Social</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="https://x.com" target="_blank" rel="noreferrer" className="text-emerald-50/85 transition hover:text-emerald-200">X / Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-emerald-50/85 transition hover:text-emerald-200">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-emerald-50/85 transition hover:text-emerald-200">LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-emerald-100/20 pt-6 text-xs text-emerald-100/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Pagee Hub. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/support" className="transition hover:text-emerald-200">Support</Link>
            <Link href="/plans" className="transition hover:text-emerald-200">Plans</Link>
            <Link href="/login" className="transition hover:text-emerald-200">Log In</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
