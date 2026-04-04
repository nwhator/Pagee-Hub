import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/session";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });
  return clearAuthCookies(response);
}

export async function GET() {
  const response = NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  return clearAuthCookies(response);
}
