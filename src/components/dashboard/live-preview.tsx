import { BusinessFormValues } from "./business-form";

export function LivePreview({ values }: { values: BusinessFormValues }) {
  return (
    <aside className="surface-card sticky top-24 h-fit p-5">
      <div className="rounded-2xl p-5 text-white" style={{ backgroundColor: values.brand_color || "#22C55E" }}>
        <h3 className="text-2xl font-black">{values.name || "Your Business"}</h3>
        <p className="text-sm text-white/85">{values.tagline || "Tagline goes here"}</p>
      </div>
      <p className="mt-4 text-sm text-slate-600">{values.about || "Describe your business, your mission, and why customers should choose you."}</p>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <button className="rounded-xl px-3 py-2 font-semibold text-white" style={{ backgroundColor: values.accent_color || values.brand_color || "#22C55E" }}>WhatsApp</button>
        <button className="rounded-xl bg-slate-950 px-3 py-2 font-semibold text-white">Call</button>
      </div>
      <p className="mt-3 text-xs text-slate-500">{values.custom_domain || `${values.subdomain || "yourbusiness"}.pagee.hub`}</p>
      <p className="mt-1 text-xs text-slate-500">Branding: {values.show_branding ? "Visible" : "Removed (Pro)"}</p>
    </aside>
  );
}
