"use client";

import { useState } from "react";

type AnalyticsResponse = {
  plan: "free" | "pro";
  totalClicks: number;
  message?: string;
  channels?: Record<string, number>;
  daily?: Record<string, number>;
  weekly?: Record<string, number>;
};

export function AnalyticsOverview() {
  const [businessId, setBusinessId] = useState("");
  const [summary, setSummary] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dailyData = summary?.daily
    ? Object.entries(summary.daily).map(([day, clicks]) => ({ day: day.slice(5), clicks }))
    : [];
  const max = dailyData.length ? Math.max(...dailyData.map((item) => item.clicks)) : 1;

  async function loadSummary() {
    if (!businessId) {
      setError("Enter a business id to load analytics.");
      return;
    }

    setError("");
    setLoading(true);
    const res = await fetch(`/api/analytics/summary?business_id=${encodeURIComponent(businessId)}`);
    const data = (await res.json()) as AnalyticsResponse | { error?: string };
    setLoading(false);

    if (!res.ok) {
      setSummary(null);
      setError((data as { error?: string }).error || "Failed to load analytics");
      return;
    }

    setSummary(data as AnalyticsResponse);
  }

  return (
    <section className="space-y-4">
      <article className="surface-card grid gap-3 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Analytics Lookup</p>
          <input
            value={businessId}
            onChange={(event) => setBusinessId(event.target.value)}
            className="mt-2 w-full rounded-xl bg-slate-100 px-3 py-3"
            placeholder="Business UUID"
          />
        </div>
        <button onClick={loadSummary} className="green-btn px-4 py-3" disabled={loading}>
          {loading ? "Loading..." : "Load analytics"}
        </button>
      </article>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

      <div className="grid gap-3 sm:grid-cols-3">
        <article className="surface-card p-5"><p className="text-sm text-slate-500">Total Clicks</p><p className="text-3xl font-black">{summary?.totalClicks ?? 0}</p></article>
        <article className="surface-card p-5"><p className="text-sm text-slate-500">Plan</p><p className="text-3xl font-black text-green-600">{summary?.plan?.toUpperCase() || "FREE"}</p></article>
        <article className="surface-card p-5"><p className="text-sm text-slate-500">Top Channel</p><p className="text-xl font-black">{summary?.channels ? Object.entries(summary.channels).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A" : "Pro only"}</p></article>
      </div>

      {summary?.plan === "free" && summary?.message ? (
        <article className="surface-card border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
          {summary.message}
        </article>
      ) : null}

      <article className="surface-card p-4 sm:p-6">
        <div className="grid h-52 grid-cols-7 items-end gap-3">
          {(dailyData.length ? dailyData.slice(-7) : [{ day: "N/A", clicks: 1 }]).map((item) => (
            <div key={item.day} className="flex flex-col items-center gap-2">
              <div className="w-full rounded-t-lg bg-green-500" style={{ height: `${(item.clicks / max) * 100}%` }} />
              <p className="text-xs font-semibold text-slate-600">{item.day}</p>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
