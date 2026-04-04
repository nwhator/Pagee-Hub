import Link from "next/link";
import { WorkspaceShell } from "@/components/shared/workspace-shell";

export default function AdminPage() {
  return (
    <WorkspaceShell title="Admin Panel">
      <section className="grid gap-4 md:grid-cols-2">
        <article className="surface-card p-6">
          <h2 className="text-xl font-black">User Management</h2>
          <p className="mt-2 text-slate-600">Track users, suspend/reactivate accounts, and remove users.</p>
          <Link href="/admin/users" className="green-btn mt-4 inline-block px-5 py-2">Open Users</Link>
        </article>
        <article className="surface-card p-6">
          <h2 className="text-xl font-black">Issue Moderation</h2>
          <p className="mt-2 text-slate-600">Review support tickets and resolve platform issues.</p>
          <Link href="/admin/issues" className="green-btn mt-4 inline-block px-5 py-2">Open Issues</Link>
        </article>
      </section>
    </WorkspaceShell>
  );
}
