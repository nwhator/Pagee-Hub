"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AuthMode = "signup" | "login" | "forgot" | "reset";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const endpointMap: Record<AuthMode, string> = {
    signup: "/api/auth/signup",
    login: "/api/auth/login",
    forgot: "/api/auth/forgot-password",
    reset: "/api/auth/reset-password"
  };

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      const payload: Record<string, unknown> = {
        email: formData.get("email"),
        password: formData.get("password")
      };

      if (mode === "forgot") {
        payload.password = undefined;
      }

      if (mode === "reset") {
        payload.access_token = formData.get("access_token");
      }

      const response = await fetch(endpointMap[mode], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data?.error?.message || data?.error || "Unable to complete request.");
        return;
      }

      if (mode === "signup") {
        setMessage("Account created. Continue onboarding.");
        const userId = typeof data?.user?.id === "string" ? data.user.id : "";
        router.push(userId ? `/onboarding?user_id=${encodeURIComponent(userId)}` : "/onboarding");
        return;
      }

      if (mode === "login") {
        router.push("/dashboard");
        return;
      }

      setMessage(data?.message || "Request completed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={onSubmit} className="surface-card mx-auto w-full max-w-md space-y-4 p-6">
      <input name="email" type="email" required placeholder="you@business.com" className="w-full rounded-xl bg-slate-100 px-4 py-3" />
      {mode !== "forgot" && <input name="password" type="password" required placeholder="Password" className="w-full rounded-xl bg-slate-100 px-4 py-3" />}
      {mode === "reset" ? <input name="access_token" required placeholder="Reset access token" className="w-full rounded-xl bg-slate-100 px-4 py-3" /> : null}
      <button type="submit" disabled={loading} className="green-btn w-full px-6 py-3 disabled:opacity-50">
        {loading ? "Please wait..." : mode === "signup" ? "Create Account" : mode === "login" ? "Sign In" : mode === "forgot" ? "Send Reset Link" : "Update Password"}
      </button>
      {message ? <p className="text-sm font-semibold text-slate-700">{message}</p> : null}
      <div className="grid grid-cols-2 gap-3 pt-1 text-sm">
        <button type="button" className="rounded-xl bg-slate-100 py-3 font-semibold">Google</button>
        <button type="button" className="rounded-xl bg-slate-100 py-3 font-semibold">Facebook</button>
      </div>
    </form>
  );
}
