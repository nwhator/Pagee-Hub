import { NextResponse } from "next/server";
import { ensureAdmin } from "@/lib/admin";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";

export async function POST(request: Request) {
  const unauthorized = ensureAdmin(request);
  if (unauthorized) return unauthorized;
  if (!hasSupabaseEnv) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const payload = await request.json();
  const title = typeof payload?.title === "string" ? payload.title.trim() : "";
  const description = typeof payload?.description === "string" ? payload.description.trim() : "";
  const priority = typeof payload?.priority === "string" ? payload.priority : "medium";

  if (!title || !description) {
    return NextResponse.json({ error: "title and description are required" }, { status: 400 });
  }

  const result = await supabaseRest("Issues", {
    method: "POST",
    useServiceRole: true,
    body: {
      title,
      description,
      priority,
      status: "open"
    }
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.data }, { status: result.status });
  }

  return NextResponse.json({ message: "Issue created", issue: result.data?.[0] ?? null }, { status: 201 });
}
