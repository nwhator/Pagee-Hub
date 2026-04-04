import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/admin";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";
import { validateId } from "@/lib/validation";

export async function POST(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const payload = await request.json();
  const idCheck = validateId(payload);
  const status = typeof payload?.status === "string" ? payload.status : "active";

  if (!idCheck.success) {
    return NextResponse.json({ error: idCheck.error }, { status: 400 });
  }

  const result = await supabaseRest("Users", {
    method: "PATCH",
    useServiceRole: true,
    query: `id=eq.${idCheck.data.id}`,
    body: { status }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json({ message: "User updated" });
}
