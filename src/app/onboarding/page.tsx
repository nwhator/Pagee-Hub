"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3 | 4 | 5;

export default function OnboardingPage() {
  const router = useRouter();

  const initialUserId = (() => {
    if (typeof window === "undefined") {
      return "";
    }
    return new URLSearchParams(window.location.search).get("user_id") || "";
  })();

  const [step, setStep] = useState<Step>(1);
  const [userId, setUserId] = useState(initialUserId);
  const [name, setName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [availability, setAvailability] = useState<"unknown" | "checking" | "available" | "taken">("unknown");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function checkSubdomain() {
    if (!subdomain) return;
    setAvailability("checking");
    const res = await fetch(`/api/business/check-subdomain?subdomain=${encodeURIComponent(subdomain)}`);
    const data = await res.json();
    setAvailability(res.ok && data?.available ? "available" : "taken");
  }

  async function finish() {
    if (!userId) {
      setMessage("User ID is required.");
      return;
    }

    setBusy(true);
    setMessage("");

    const res = await fetch("/api/business/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": userId
      },
      body: JSON.stringify({
        subdomain,
        name,
        tagline: "",
        custom_domain: "",
        whatsapp,
        phone,
        instagram: "",
        about,
        services: [],
        show_branding: true,
        brand_color: "#22C55E",
        accent_color: "#16A34A",
        logo_url: logoUrl,
        media_urls: []
      })
    });

    const data = await res.json();
    setBusy(false);

    if (!res.ok) {
      setMessage(data?.error || "Unable to create your page");
      return;
    }

    setMessage(`Success! Share link: https://${subdomain}.pagee.hub`);
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <section className="surface-card space-y-5 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Onboarding</p>
        <h1 className="text-3xl font-black tracking-tight">Set up your business page</h1>

        {step === 1 ? (
          <div className="space-y-3">
            <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID (UUID)" className="w-full rounded-xl bg-slate-100 px-4 py-3" />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Business name" className="w-full rounded-xl bg-slate-100 px-4 py-3" />
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            <input value={subdomain} onChange={(e) => setSubdomain(e.target.value.toLowerCase())} placeholder="Subdomain (yourname)" className="w-full rounded-xl bg-slate-100 px-4 py-3" />
            <button onClick={checkSubdomain} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Check availability</button>
            <p className="text-sm font-semibold text-slate-700">{availability === "available" ? "Available" : availability === "taken" ? "Taken" : availability === "checking" ? "Checking..." : ""}</p>
          </div>
        ) : null}

        {step === 3 ? (
          <div className="space-y-3">
            <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="WhatsApp" className="w-full rounded-xl bg-slate-100 px-4 py-3" />
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full rounded-xl bg-slate-100 px-4 py-3" />
          </div>
        ) : null}

        {step === 4 ? (
          <textarea value={about} onChange={(e) => setAbout(e.target.value)} placeholder="Business description" rows={4} className="w-full rounded-xl bg-slate-100 px-4 py-3" />
        ) : null}

        {step === 5 ? (
          <div className="space-y-3">
            <input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Logo URL (temporary)" className="w-full rounded-xl bg-slate-100 px-4 py-3" />
            <button onClick={finish} disabled={busy} className="green-btn w-full px-6 py-3 disabled:opacity-50">
              {busy ? "Creating..." : "Create Page"}
            </button>
          </div>
        ) : null}

        <div className="flex justify-between pt-3">
          <button onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev))} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold">Back</button>
          {step < 5 ? (
            <button onClick={() => setStep((prev) => (prev < 5 ? ((prev + 1) as Step) : prev))} className="green-btn px-4 py-2 text-sm">
              Continue
            </button>
          ) : null}
        </div>

        {message ? <p className="text-sm font-semibold text-slate-700">{message}</p> : null}
      </section>
    </main>
  );
}
