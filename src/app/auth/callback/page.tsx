"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Confirming your account…");

  useEffect(() => {
    async function handleCallback() {
      // Supabase appends session tokens as a URL hash fragment after email confirmation.
      // Hash fragments are not sent to the server, so we read them client-side here.
      const hash = typeof window !== "undefined" ? window.location.hash.substring(1) : "";
      const search = typeof window !== "undefined" ? window.location.search.substring(1) : "";

      const hashParams = new URLSearchParams(hash);
      const queryParams = new URLSearchParams(search);

      const accessToken = hashParams.get("access_token") || queryParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token") || queryParams.get("refresh_token");
      const expiresIn = hashParams.get("expires_in") || queryParams.get("expires_in");
      const type = hashParams.get("type") || queryParams.get("type");

      if (!accessToken) {
        setMessage("Invalid or expired confirmation link. Redirecting to login…");
        setTimeout(() => router.replace("/login"), 2500);
        return;
      }

      const response = await fetch("/api/auth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken,
          expires_in: expiresIn ? Number(expiresIn) : undefined,
        }),
      });

      if (!response.ok) {
        setMessage("Could not confirm your account. Please try logging in.");
        setTimeout(() => router.replace("/login"), 2500);
        return;
      }

      if (type === "recovery") {
        router.replace("/reset-password");
      } else {
        router.replace("/dashboard");
      }
    }

    handleCallback();
  }, [router]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 text-center sm:px-6">
      <p className="text-lg font-semibold text-slate-700">{message}</p>
    </main>
  );
}
