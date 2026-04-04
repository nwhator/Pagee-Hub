"use client";

export function MediaUploader() {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm sm:p-6">
      <h3 className="text-xl font-black">Media Uploads</h3>
      <p className="mt-1 text-sm text-slate-600">Upload logo and gallery images/videos (Supabase Storage integration placeholder).</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-semibold">Upload Logo</button>
        <button className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-sm font-semibold">Upload Gallery Media</button>
      </div>
    </section>
  );
}
