"use client";

import { useEffect, useState } from "react";

type Issue = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
};

export function IssuesBoard() {
  const [adminKey, setAdminKey] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);

  async function loadIssues() {
    const res = await fetch("/api/admin/issues/list", {
      headers: { "x-admin-key": adminKey }
    });
    const data = await res.json();
    setIssues(Array.isArray(data?.issues) ? data.issues : []);
  }

  async function updateIssue(id: string, status: string) {
    await fetch("/api/admin/issues/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": adminKey
      },
      body: JSON.stringify({ id, status })
    });
    await loadIssues();
  }

  useEffect(() => {
    if (adminKey) {
      void loadIssues();
    }
  }, [adminKey]);

  return (
    <section className="surface-card p-6">
      <h2 className="text-xl font-black">Issue Tracking</h2>
      <p className="mt-1 text-sm text-slate-600">Track and fix user-reported issues.</p>
      <input
        type="password"
        value={adminKey}
        onChange={(e) => setAdminKey(e.target.value)}
        placeholder="Admin API key"
        className="mt-4 w-full rounded-xl bg-slate-100 px-4 py-3"
      />

      <div className="mt-4 space-y-3">
        {issues.map((issue) => (
          <article key={issue.id} className="rounded-xl bg-slate-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-bold">{issue.title}</p>
              <p className="text-xs uppercase tracking-wider text-slate-500">{issue.priority}</p>
            </div>
            <p className="mt-1 text-sm text-slate-700">{issue.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <button onClick={() => updateIssue(issue.id, "open")} className="rounded-full bg-slate-200 px-3 py-1">Open</button>
              <button onClick={() => updateIssue(issue.id, "in_progress")} className="rounded-full bg-amber-200 px-3 py-1">In Progress</button>
              <button onClick={() => updateIssue(issue.id, "resolved")} className="rounded-full bg-green-200 px-3 py-1">Resolved</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
