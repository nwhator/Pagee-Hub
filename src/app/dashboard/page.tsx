"use client";

import { useEffect, useState } from "react";
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
  brand_color: "#22C55E",
  accent_color: "#16A34A"
};

function getTemplateFromQuery() {
  if (typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const templateId = params.get("template") || "";
  if (!templateId) {
    return null;
  }

  return getTemplateById(templateId);
}

export default function DashboardPage() {
  const [values, setValues] = useState<BusinessFormValues>(() => getTemplateFromQuery()?.defaultValues ?? defaults);
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState(() => {
    const template = getTemplateFromQuery();
    return template ? `Template applied: ${template.name}` : "";
  });
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessionAndBusiness() {
      const sessionResponse = await fetch("/api/auth/session", { credentials: "same-origin" });
      const sessionData = await sessionResponse.json();

      const resolvedUserId = typeof sessionData?.user?.id === "string" ? sessionData.user.id : "";
      if (!resolvedUserId) {
        setMessage("Please log in to access your dashboard.");
        window.location.href = "/login?next=/dashboard";
        return;
      }

      setUserId(resolvedUserId);

      const response = await fetch("/api/business/me", { credentials: "same-origin" });
      const data = await response.json();

      if (response.ok && data?.page?.id) {
        setBusinessId(data.page.id);
        setMessage((previous) => previous || "Existing page found. Save will update this page.");
        return;
      }

      setBusinessId(null);
      setMessage((previous) => previous || "No existing page found. Save will create a new page.");
    }

    void loadSessionAndBusiness();
  }, []);

  async function loadExistingBusiness() {
    const response = await fetch("/api/business/me", {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" }
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
      setMessage("Please log in to save your page.");
      return;
    }

    setMessage("");
    const target = businessId ? "/api/business/update" : "/api/business/create";
    const payload = businessId ? { ...values, id: businessId } : values;

    const response = await fetch(target, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
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

      <section className="surface-card grid gap-3 p-4 sm:grid-cols-[auto_1fr] sm:items-end">
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
