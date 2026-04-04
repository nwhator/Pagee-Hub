"use client";

const sample = [
  { day: "Mon", clicks: 30 },
  { day: "Tue", clicks: 43 },
  { day: "Wed", clicks: 39 },
  { day: "Thu", clicks: 57 },
  { day: "Fri", clicks: 64 },
  { day: "Sat", clicks: 36 },
  { day: "Sun", clicks: 48 }
];

export function AnalyticsOverview() {
  const max = Math.max(...sample.map((item) => item.clicks));

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <article className="surface-card p-5"><p className="text-sm text-slate-500">Total Clicks</p><p className="text-3xl font-black">1,284</p></article>
        <article className="surface-card p-5"><p className="text-sm text-slate-500">WhatsApp</p><p className="text-3xl font-black text-green-600">+24%</p></article>
        <article className="surface-card p-5"><p className="text-sm text-slate-500">Top Link</p><p className="text-xl font-black">Instagram</p></article>
      </div>
      <article className="surface-card p-4 sm:p-6">
        <div className="grid h-52 grid-cols-7 items-end gap-3">
          {sample.map((item) => (
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
