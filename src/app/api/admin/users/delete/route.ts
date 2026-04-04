import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/admin";
import { validateId } from "@/lib/validation";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";

export async function POST(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const parsed = validateId(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  await supabaseRest("BusinessPages", {
    method: "DELETE",
    useServiceRole: true,
    query: `user_id=eq.${parsed.data.id}`
  });

  const result = await supabaseRest("Users", {
    method: "DELETE",
    useServiceRole: true,
    query: `id=eq.${parsed.data.id}`
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json({ message: "User deleted" });
}
