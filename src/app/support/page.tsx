"use client";

import { useState } from "react";
import { WorkspaceShell } from "@/components/shared/workspace-shell";

export default function SupportPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  async function submitTicket() {
    const res = await fetch("/api/support/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, priority: "medium" })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data?.error || "Unable to create support ticket");
      return;
    }
    setTitle("");
    setDescription("");
    setMessage(data?.message || "Support ticket created");
  }

  return (
    <WorkspaceShell title="Help & Support">
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">FAQ</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
          <li>How do I publish my page?</li>
          <li>How do I connect Stripe billing?</li>
          <li>How do I track click sources?</li>
        </ul>
      </section>
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Contact Support</h2>
        <input
          className="mt-3 w-full rounded-xl bg-slate-100 px-4 py-3"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Issue title"
        />
        <textarea
          className="mt-3 w-full rounded-xl bg-slate-100 px-4 py-3"
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Tell us what you need help with"
        />
        <button onClick={submitTicket} className="green-btn mt-3 px-6 py-3">Submit Ticket</button>
        {message ? <p className="mt-2 text-sm text-slate-600">{message}</p> : null}
      </section>
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Chatbot (Optional Placeholder)</h2>
        <p className="mt-2 text-slate-600">Future AI assistant integration point.</p>
      </section>
    </WorkspaceShell>
  );
}
