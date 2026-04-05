import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-emerald-100/15 bg-black/25 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-black tracking-tight text-emerald-50">
          Pagee Hub
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="/plans" className="rounded-full px-4 py-2 text-sm font-semibold text-emerald-50/90 hover:bg-emerald-100/10">
            Pricing
          </Link>
          <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-emerald-50/90 hover:bg-emerald-100/10">
            Login
          </Link>
          <Link href="/signup" className="green-btn px-5 py-2 text-sm shadow-[0_8px_25px_rgba(33,223,139,0.35)]">
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
