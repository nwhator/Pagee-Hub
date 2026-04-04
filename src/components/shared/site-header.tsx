import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-black tracking-tight">
          Pagee Hub
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/plans" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Pricing
          </Link>
          <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
            Login
          </Link>
          <Link href="/signup" className="green-btn px-5 py-2 text-sm">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
