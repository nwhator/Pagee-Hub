"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type AuthMode = "signup" | "login" | "forgot" | "reset";

function toErrorMessage(input: unknown) {
  if (typeof input === "string") {
    return input;
  }

  if (input && typeof input === "object") {
    const value = input as { message?: unknown; msg?: unknown; error?: unknown; error_description?: unknown };
    if (typeof value.message === "string") return value.message;
    if (typeof value.msg === "string") return value.msg;
    if (typeof value.error === "string") return value.error;
    if (typeof value.error_description === "string") return value.error_description;
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "Unable to complete request.";
    }
  }

  return "Unable to complete request.";
}

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [emailValue, setEmailValue] = useState("");

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
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(toErrorMessage(data?.error));
        return;
      }

      if (mode === "signup") {
        if (data?.requires_email_verification) {
          setMessage(
            data?.message ||
              "Account created. A verification email has been sent. Check your inbox and then sign in."
          );
          return;
        }

        setMessage("Account created. Continue onboarding.");
        const userId = typeof data?.user?.id === "string" ? data.user.id : "";
        router.push(userId ? `/onboarding?user_id=${encodeURIComponent(userId)}` : "/onboarding");
        return;
      }

      if (mode === "login") {
        const nextPath = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;
        if (typeof window !== "undefined") {
          window.location.href = nextPath || "/dashboard";
        } else {
          router.push(nextPath || "/dashboard");
        }
        return;
      }

      setMessage(data?.message || "Request completed.");
    } finally {
      setLoading(false);
    }
  }

  async function resendVerificationEmail() {
    if (!emailValue.includes("@")) {
      setMessage("Enter your email first, then tap resend verification.");
      return;
    }

    setResendLoading(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setMessage(toErrorMessage(data?.error));
        return;
      }

      setMessage(data?.message || "Verification email sent.");
    } finally {
      setResendLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit(new FormData(event.currentTarget));
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card mx-auto w-full max-w-md space-y-4 p-6">
      <input
        name="email"
        type="email"
        required
        placeholder="you@business.com"
        value={emailValue}
        onChange={(event) => setEmailValue(event.target.value)}
        className="w-full rounded-xl bg-slate-100 px-4 py-3"
      />
      {mode !== "forgot" && <input name="password" type="password" required placeholder="Password" className="w-full rounded-xl bg-slate-100 px-4 py-3" />}
      {mode === "reset" ? <input name="access_token" required placeholder="Reset access token" className="w-full rounded-xl bg-slate-100 px-4 py-3" /> : null}

      {mode === "login" ? (
        <div className="flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="font-semibold text-emerald-200 hover:text-emerald-100">
            Forgot password?
          </Link>
          <button
            type="button"
            onClick={resendVerificationEmail}
            disabled={resendLoading}
            className="font-semibold text-emerald-200 hover:text-emerald-100 disabled:opacity-60"
          >
            {resendLoading ? "Sending..." : "Resend verification"}
          </button>
        </div>
      ) : null}

      <button type="submit" disabled={loading} className="green-btn w-full px-6 py-3 disabled:opacity-50">
        {loading ? "Please wait..." : mode === "signup" ? "Create Account" : mode === "login" ? "Sign In" : mode === "forgot" ? "Send Reset Link" : "Update Password"}
      </button>
      {message ? <p className="text-sm font-semibold text-slate-700">{message}</p> : null}
    </form>
  );
}
