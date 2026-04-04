import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { WorkspaceShell } from "@/components/shared/workspace-shell";

export default function AnalyticsPage() {
  return (
    <WorkspaceShell title="Analytics & Insights">
      <AnalyticsOverview />
    </WorkspaceShell>
  );
}
