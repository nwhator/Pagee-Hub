"use client";

import Link from "next/link";
import { useState } from "react";
import { TemplateLibrary } from "@/components/dashboard/template-library";
import { WorkspaceShell } from "@/components/shared/workspace-shell";
import type { PageTemplate } from "@/lib/templates";

export default function TemplateLibraryPage() {
  const [selected, setSelected] = useState<PageTemplate | null>(null);

  return (
    <WorkspaceShell title="Template Library">
      <TemplateLibrary onApply={setSelected} />

      {selected ? (
        <section className="surface-card p-5 sm:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Selected Template</p>
          <h2 className="mt-1 text-2xl font-black">{selected.name}</h2>
          <p className="mt-1 text-slate-600">Use this in Page Creator to publish your website.</p>
          <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <p><span className="font-semibold">Subdomain:</span> {selected.defaultValues.subdomain}.pagee.org</p>
            <p><span className="font-semibold">Brand color:</span> {selected.defaultValues.brand_color}</p>
          </div>
          <Link href={`/dashboard?template=${encodeURIComponent(selected.id)}`} className="green-btn mt-4 inline-flex px-4 py-2">
            Use In Page Creator
          </Link>
        </section>
      ) : null}
    </WorkspaceShell>
  );
}
