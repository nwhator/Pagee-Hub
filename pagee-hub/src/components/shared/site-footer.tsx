export function SiteFooter() {
  return (
    <footer className="mt-16 bg-black text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="text-lg font-bold">Pagee Hub</p>
          <p className="mt-2 text-sm text-white/75">One-page business profiles for modern entrepreneurs.</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/80">Product</p>
          <ul className="mt-2 space-y-1 text-sm text-white/70">
            <li>Templates</li>
            <li>Analytics</li>
            <li>Billing</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-white/80">Social</p>
          <ul className="mt-2 space-y-1 text-sm text-white/70">
            <li>X / Twitter</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
