import { IssuesBoard } from "@/components/admin/issues-board";
import { WorkspaceShell } from "@/components/shared/workspace-shell";

export default function AdminIssuesPage() {
  return (
    <WorkspaceShell title="Admin • Issues">
      <IssuesBoard />
    </WorkspaceShell>
  );
}
