import { NextResponse } from "next/server";
import { hasSupabaseEnv, supabaseTokenLogin } from "@/lib/supabase";
import { withAuthCookies } from "@/lib/session";
import { ensureUserProfile } from "@/lib/user-profile";

type AuthErrorShape = {
  code?: string;
  error_code?: string;
  message?: string;
  msg?: string;
  error_description?: string;
};

function getAuthErrorDetails(error: unknown) {
  const fallback = {
    message: "Unable to sign in. Please verify your email and password.",
    status: 400
  };

  if (typeof error === "string") {
    return { message: error, status: 400 };
  }

  if (error && typeof error === "object") {
    const candidate = error as AuthErrorShape;
    const code = (candidate.error_code || candidate.code || "").toLowerCase();
    const rawMessage =
      typeof candidate.message === "string"
        ? candidate.message
        : typeof candidate.msg === "string"
          ? candidate.msg
          : typeof candidate.error_description === "string"
            ? candidate.error_description
            : "";

    if (code.includes("unsupported_grant_type") || rawMessage.toLowerCase().includes("unsupported_grant_type")) {
      return {
        message: "Login failed because the auth grant type is unsupported. This is a server-side auth request issue.",
        status: 400
      };
    }

    if (code.includes("invalid_credentials") || rawMessage.toLowerCase().includes("invalid login credentials")) {
      return {
        message: "Email or password is incorrect.",
        status: 401
      };
    }

    if (code.includes("email_not_confirmed") || rawMessage.toLowerCase().includes("email not confirmed")) {
      return { message: "Please verify your email before signing in.", status: 401 };
    }

    if (code.includes("too_many") || rawMessage.toLowerCase().includes("too many requests")) {
      return { message: "Too many login attempts. Please try again in a few minutes.", status: 429 };
    }

    if (rawMessage) {
      return { message: rawMessage, status: 400 };
    }
  }

  return fallback;
}

export async function POST(request: Request) {
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  if (!rawBody) {
    console.error("Login request body is empty");
    return NextResponse.json(
      { error: "Request body is empty", details: { rawBody } },
      { status: 400 }
    );
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch (error) {
    console.error("Login request JSON parse failed", rawBody, error);
    return NextResponse.json(
      {
        error: "Invalid JSON request body",
        details: { rawBody, message: error instanceof Error ? error.message : String(error) }
      },
      { status: 400 }
    );
  }

  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const password = typeof payload.password === "string" ? payload.password : "";

  if (!email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (!password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const result = await supabaseTokenLogin(email, password);
  if (!result.ok) {
    const authError = getAuthErrorDetails(result.data);
    const status = result.status >= 500 ? result.status : authError.status;
    console.error("Supabase login failed", { status: result.status, data: result.data });
    return NextResponse.json(
      { error: authError.message, details: result.data },
      { status }
    );
  }

  const synced = await ensureUserProfile({
    id: result.data?.user?.id,
    email: result.data?.user?.email
  });

  if (!synced.ok) {
    return NextResponse.json({ error: "Signed in, but failed to prepare your account profile. Please try again." }, { status: 500 });
  }

  const response = NextResponse.json({
    user: result.data?.user ?? null,
    message: "Login successful"
  });

  return withAuthCookies(response, result.data ?? {});
}
