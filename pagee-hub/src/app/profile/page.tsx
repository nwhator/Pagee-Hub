export default function ProfilePage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-10 sm:px-6">
      <h1 className="text-4xl font-black tracking-tight">Profile & Account Settings</h1>
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Personal Info</h2>
        <p className="mt-2 text-slate-600">Manage email, password, and preferences.</p>
      </section>
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Business Pages</h2>
        <p className="mt-2 text-slate-600">Manage your published pages and custom domains.</p>
      </section>
    </main>
  );
}
