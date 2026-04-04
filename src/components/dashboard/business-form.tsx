"use client";

import { useState } from "react";

export type BusinessFormValues = {
  subdomain: string;
  name: string;
  tagline: string;
  whatsapp: string;
  phone: string;
  instagram: string;
  about: string;
  services: { name: string; price: string }[];
  brand_color: string;
};

export function BusinessForm({
  values,
  onChange,
  onSave
}: {
  values: BusinessFormValues;
  onChange: (next: BusinessFormValues) => void;
  onSave: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await onSave();
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="space-y-4 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-2xl font-black tracking-tight">Business Details</h2>
      <div className="grid gap-3">
        <input className="rounded-xl bg-slate-100 px-4 py-3" value={values.subdomain} onChange={(e) => onChange({ ...values, subdomain: e.target.value })} placeholder="yourbusiness" />
        <input className="rounded-xl bg-slate-100 px-4 py-3" value={values.name} onChange={(e) => onChange({ ...values, name: e.target.value })} placeholder="Business Name" />
        <input className="rounded-xl bg-slate-100 px-4 py-3" value={values.tagline} onChange={(e) => onChange({ ...values, tagline: e.target.value })} placeholder="Tagline" />
        <textarea className="rounded-xl bg-slate-100 px-4 py-3" rows={4} value={values.about} onChange={(e) => onChange({ ...values, about: e.target.value })} placeholder="About your business" />
        <div className="grid grid-cols-2 gap-3">
          <input className="rounded-xl bg-slate-100 px-4 py-3" value={values.whatsapp} onChange={(e) => onChange({ ...values, whatsapp: e.target.value })} placeholder="WhatsApp" />
          <input className="rounded-xl bg-slate-100 px-4 py-3" value={values.phone} onChange={(e) => onChange({ ...values, phone: e.target.value })} placeholder="Phone" />
        </div>
        <input className="rounded-xl bg-slate-100 px-4 py-3" value={values.instagram} onChange={(e) => onChange({ ...values, instagram: e.target.value })} placeholder="Instagram" />
        <label className="text-sm font-semibold">Brand color</label>
        <input type="color" value={values.brand_color} onChange={(e) => onChange({ ...values, brand_color: e.target.value })} className="h-12 w-full rounded-xl" />
      </div>
      <button onClick={submit} disabled={busy} className="green-btn w-full px-6 py-3 disabled:opacity-60">
        {busy ? "Saving..." : "Save / Publish"}
      </button>
    </section>
  );
}
