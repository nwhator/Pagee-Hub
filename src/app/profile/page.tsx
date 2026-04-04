import { WorkspaceShell } from "@/components/shared/workspace-shell";

export default function ProfilePage() {
  return (
    <WorkspaceShell title="Profile & Account Settings">
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Personal Info</h2>
        <p className="mt-2 text-slate-600">Manage email, password, and preferences.</p>
      </section>
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Business Pages</h2>
        <p className="mt-2 text-slate-600">Manage your published pages and custom domains.</p>
      </section>
    </WorkspaceShell>
  );
}
