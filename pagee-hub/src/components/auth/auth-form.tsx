"use client";

import { useState } from "react";

type AuthMode = "signup" | "login" | "forgot" | "reset";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [loading, setLoading] = useState(false);

  const endpointMap: Record<AuthMode, string> = {
    signup: "/api/auth/signup",
    login: "/api/auth/login",
    forgot: "/api/auth/login",
    reset: "/api/auth/login"
  };

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      await fetch(endpointMap[mode], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password")
        })
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="surface-card mx-auto w-full max-w-md space-y-4 p-6">
      <input name="email" type="email" required placeholder="you@business.com" className="w-full rounded-xl bg-slate-100 px-4 py-3" />
      {mode !== "forgot" && <input name="password" type="password" required placeholder="Password" className="w-full rounded-xl bg-slate-100 px-4 py-3" />}
      <button type="submit" disabled={loading} className="green-btn w-full px-6 py-3 disabled:opacity-50">
        {loading ? "Please wait..." : mode === "signup" ? "Create Account" : mode === "login" ? "Sign In" : mode === "forgot" ? "Send Reset Link" : "Update Password"}
      </button>
      <div className="grid grid-cols-2 gap-3 pt-1 text-sm">
        <button type="button" className="rounded-xl bg-slate-100 py-3 font-semibold">Google</button>
        <button type="button" className="rounded-xl bg-slate-100 py-3 font-semibold">Facebook</button>
      </div>
    </form>
  );
}
