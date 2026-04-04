"use client";

import { pageTemplates, type PageTemplate } from "@/lib/templates";

export function TemplateLibrary({ onApply }: { onApply: (template: PageTemplate) => void }) {
  return (
    <section className="surface-card space-y-4 p-5 sm:p-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Template Library</p>
        <h2 className="mt-1 text-2xl font-black tracking-tight">Generate your page from a proven starting point</h2>
        <p className="mt-2 text-sm text-slate-600">
          Pick a template to auto-fill business details, color style, and services. You can edit everything before publishing.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {pageTemplates.map((template) => (
          <article key={template.id} className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{template.category}</p>
            <h3 className="mt-1 text-lg font-black">{template.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{template.description}</p>
            <p className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{template.previewTag}</p>
            <button onClick={() => onApply(template)} className="green-btn mt-4 w-full px-4 py-2">
              Use Template
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
