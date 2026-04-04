"use client";

import { useState } from "react";
import { BusinessForm, BusinessFormValues } from "@/components/dashboard/business-form";
import { LivePreview } from "@/components/dashboard/live-preview";
import { MediaUploader } from "@/components/dashboard/media-uploader";
import { WorkspaceShell } from "@/components/shared/workspace-shell";

const defaults: BusinessFormValues = {
  subdomain: "yourbusiness",
  name: "The Artisan Loft",
  tagline: "Handcrafted with soul",
  whatsapp: "",
  phone: "",
  instagram: "",
  about: "Tell your story and what your business offers.",
  services: [
    { name: "Starter Package", price: "$49" },
    { name: "Premium Package", price: "$99" }
  ],
  brand_color: "#22C55E"
};

export default function DashboardPage() {
  const [values, setValues] = useState(defaults);

  async function saveBusiness() {
    await fetch("/api/business/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    });
  }

  return (
    <WorkspaceShell title="Page Creator">
      <section className="grid gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 sm:grid-cols-3">
        <article className="rounded-xl bg-white/70 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Pro</p>
          <p className="mt-1 text-sm font-bold">Unlock custom domain</p>
        </article>
        <article className="rounded-xl bg-white/70 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Pro</p>
          <p className="mt-1 text-sm font-bold">Remove branding</p>
        </article>
        <article className="rounded-xl bg-white/70 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Pro</p>
          <p className="mt-1 text-sm font-bold">See detailed analytics</p>
        </article>
      </section>

      <main className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-6">
          <BusinessForm values={values} onChange={setValues} onSave={saveBusiness} />
          <MediaUploader />
        </div>
        <LivePreview values={values} />
      </main>
    </WorkspaceShell>
  );
}
