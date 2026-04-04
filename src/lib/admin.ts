import { NextResponse } from "next/server";

export function ensureAdmin(request: Request) {
  const configuredKey = process.env.ADMIN_API_KEY || "";
  const requestKey = request.headers.get("x-admin-key") || "";

  if (!configuredKey) {
    return NextResponse.json({ error: "Admin key is not configured" }, { status: 503 });
  }

  if (!requestKey || requestKey !== configuredKey) {
    return NextResponse.json({ error: "Unauthorized admin request" }, { status: 401 });
  }

  return null;
}
