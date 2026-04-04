"use client";

import { useState } from "react";
import { WorkspaceShell } from "@/components/shared/workspace-shell";

export default function ReviewsPage() {
  const [review, setReview] = useState({ user_name: "", rating: 5, comment: "" });

  async function createReview() {
    await fetch("/api/reviews/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...review, business_id: "00000000-0000-0000-0000-000000000000" })
    });
  }

  return (
    <WorkspaceShell title="Reviews Management">
      <section className="surface-card space-y-3 p-6">
        <h2 className="text-xl font-bold">Add / Edit / Delete / Reply</h2>
        <input className="w-full rounded-xl bg-slate-100 px-4 py-3" value={review.user_name} onChange={(e) => setReview({ ...review, user_name: e.target.value })} placeholder="Reviewer name" />
        <textarea className="w-full rounded-xl bg-slate-100 px-4 py-3" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} placeholder="Comment" />
        <button onClick={createReview} className="green-btn px-6 py-3">Save Review</button>
      </section>
      <section className="surface-card p-6">
        <h2 className="text-xl font-bold">Admin Moderation Panel</h2>
        <p className="mt-2 text-slate-600">Moderation queue placeholder.</p>
      </section>
    </WorkspaceShell>
  );
}
