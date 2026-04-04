import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Page Creator" },
  { href: "/template-library", label: "Template Library" },
  { href: "/analytics", label: "Analytics" },
  { href: "/reviews", label: "Reviews" },
  { href: "/plans", label: "Plans" },
  { href: "/billing", label: "Billing" },
  { href: "/profile", label: "Profile" },
  { href: "/support", label: "Support" },
  { href: "/admin", label: "Admin" }
];

export function WorkspaceShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-xl font-black tracking-tight">Pagee Hub</Link>
          <nav className="hidden items-center gap-2 md:flex">
            {links.slice(0, 5).map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="surface-card h-fit p-4">
          <p className="px-2 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
          <div className="grid gap-1">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                {link.label}
              </Link>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          <h1 className="text-4xl font-black tracking-tight">{title}</h1>
          {children}
        </div>
      </div>

      <footer className="mt-8 border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-500 sm:px-6">
          Pagee Hub workspace • Manage pages, analytics, subscriptions, and support.
        </div>
      </footer>
    </div>
  );
}
