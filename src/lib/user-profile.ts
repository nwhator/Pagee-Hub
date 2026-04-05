import { supabaseRest } from "@/lib/supabase";

type AuthUser = {
  id?: string;
  email?: string;
};

function escapeQueryValue(value: string) {
  return encodeURIComponent(value);
}

export async function ensureUserProfile(user: AuthUser) {
  const id = typeof user.id === "string" ? user.id : "";
  const email = typeof user.email === "string" ? user.email.trim().toLowerCase() : "";

  if (!id || !email) {
    return { ok: false, reason: "missing_user_fields" as const };
  }

  const byId = await supabaseRest("Users", {
    method: "GET",
    useServiceRole: true,
    query: `select=id,email&id=eq.${escapeQueryValue(id)}&limit=1`
  });

  if (!byId.ok) {
    return { ok: false, reason: "lookup_by_id_failed" as const, detail: byId.data };
  }

  if (Array.isArray(byId.data) && byId.data.length > 0) {
    const current = byId.data[0] as { email?: string };
    if ((current.email || "").toLowerCase() !== email) {
      const updated = await supabaseRest("Users", {
        method: "PATCH",
        useServiceRole: true,
        query: `id=eq.${escapeQueryValue(id)}`,
        body: { email }
      });

      if (!updated.ok) {
        return { ok: false, reason: "update_failed" as const, detail: updated.data };
      }
    }

    return { ok: true as const };
  }

  const byEmail = await supabaseRest("Users", {
    method: "GET",
    useServiceRole: true,
    query: `select=id,email&email=eq.${escapeQueryValue(email)}&limit=1`
  });

  if (!byEmail.ok) {
    return { ok: false, reason: "lookup_by_email_failed" as const, detail: byEmail.data };
  }

  if (Array.isArray(byEmail.data) && byEmail.data.length > 0) {
    return { ok: true as const, warning: "email_already_linked_to_another_profile" as const };
  }

  const created = await supabaseRest("Users", {
    method: "POST",
    useServiceRole: true,
    body: {
      id,
      email
    }
  });

  if (!created.ok) {
    return { ok: false, reason: "create_failed" as const, detail: created.data };
  }

  return { ok: true as const };
}
