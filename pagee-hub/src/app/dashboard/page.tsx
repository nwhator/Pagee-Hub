"use client";

import { useState } from "react";
import { BusinessForm, BusinessFormValues } from "@/components/dashboard/business-form";
import { LivePreview } from "@/components/dashboard/live-preview";
import { MediaUploader } from "@/components/dashboard/media-uploader";

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
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1.35fr_1fr]">
      <div className="space-y-6">
        <BusinessForm values={values} onChange={setValues} onSave={saveBusiness} />
        <MediaUploader />
      </div>
      <LivePreview values={values} />
    </main>
  );
}
