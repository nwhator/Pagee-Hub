import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[320px_1fr]">
      <aside className="hidden bg-black p-8 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-2xl font-black tracking-tight">Pagee Hub</p>
          <p className="mt-4 text-sm text-white/70">Business page creator for modern entrepreneurs.</p>
        </div>
        <div className="space-y-2 text-sm text-white/80">
          <p>• Launch your profile quickly</p>
          <p>• Add contact buttons, gallery, reviews</p>
          <p>• Track clicks and conversion insights</p>
        </div>
      </aside>

      <section className="min-h-screen bg-(--surface)">
        <header className="border-b border-black/5 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="mx-auto flex w-full max-w-4xl items-center justify-between">
            <Link href="/" className="text-xl font-black tracking-tight">Pagee Hub</Link>
            <div className="flex gap-2">
              <Link href="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Login</Link>
              <Link href="/signup" className="green-btn px-4 py-2 text-sm">Sign Up</Link>
            </div>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}
