import { AnalyticsOverview } from "@/components/analytics/analytics-overview";

export default function AnalyticsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-6 text-4xl font-black tracking-tight">Analytics & Insights</h1>
      <AnalyticsOverview />
    </main>
  );
}
