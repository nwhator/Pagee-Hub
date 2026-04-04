"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { BusinessForm, BusinessFormValues } from "@/components/dashboard/business-form";
import { LivePreview } from "@/components/dashboard/live-preview";
import { MediaUploader } from "@/components/dashboard/media-uploader";
import { TemplateLibrary } from "@/components/dashboard/template-library";
import { WorkspaceShell } from "@/components/shared/workspace-shell";
import { getTemplateById, type PageTemplate } from "@/lib/templates";

const defaults: BusinessFormValues = {
  subdomain: "yourbusiness",
  name: "The Artisan Loft",
  tagline: "Handcrafted with soul",
  custom_domain: "",
  whatsapp: "",
  phone: "",
  instagram: "",
  about: "Tell your story and what your business offers.",
  services: [
    { name: "Starter Package", price: "$49" },
    { name: "Premium Package", price: "$99" }
  ],
  show_branding: true,
  brand_color: "#22C55E"
};

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") || "";
  const templateFromUrl = templateId ? getTemplateById(templateId) : null;
  const [values, setValues] = useState<BusinessFormValues>(templateFromUrl?.defaultValues ?? defaults);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState(templateFromUrl ? `Template applied: ${templateFromUrl.name}` : "");
  const [businessId, setBusinessId] = useState<string | null>(null);

  async function loadExistingBusiness() {
    if (!userId) {
      setBusinessId(null);
      setMessage("Enter your user UUID first.");
      return;
    }

    const response = await fetch("/api/business/me", {
      headers: { "x-user-id": userId }
    });
    const data = await response.json();

    if (response.ok && data?.page?.id) {
      setBusinessId(data.page.id);
      setMessage("Existing page found. Save will update this page.");
      return;
    }

    setBusinessId(null);
    setMessage("No existing page found. Save will create a new page.");
  }

  async function saveBusiness() {
    if (!userId) {
      setMessage("Enter your user UUID first.");
      return;
    }

    setMessage("");
    const target = businessId ? "/api/business/update" : "/api/business/create";
    const payload = businessId ? { ...values, id: businessId } : values;

    const response = await fetch(target, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(userId ? { "x-user-id": userId } : {})
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data?.error || "Unable to save page.");
      return;
    }

    const savedId = data?.id || businessId;
    if (savedId) {
      setBusinessId(savedId);
    }

    setMessage(`Saved. Public URL: /b/${values.subdomain}`);
  }

  function applyTemplate(template: PageTemplate) {
    setValues(template.defaultValues);
    setMessage(`Template applied: ${template.name}`);
  }

  return (
    <WorkspaceShell title="Page Creator">
      <TemplateLibrary onApply={applyTemplate} />

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

      <section className="surface-card grid gap-3 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <label className="space-y-2 text-sm font-semibold text-slate-700">
          User ID (UUID)
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="Used for plan limits and ownership"
            className="w-full rounded-xl bg-slate-100 px-3 py-3"
          />
        </label>
        <button onClick={loadExistingBusiness} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
          Load Account Page
        </button>
        {message ? <p className="text-sm font-semibold text-slate-700">{message}</p> : null}
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
