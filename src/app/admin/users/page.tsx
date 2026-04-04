import { UsersTable } from "@/components/admin/users-table";
import { WorkspaceShell } from "@/components/shared/workspace-shell";

export default function AdminUsersPage() {
  return (
    <WorkspaceShell title="Admin • Users">
      <UsersTable />
    </WorkspaceShell>
  );
}
