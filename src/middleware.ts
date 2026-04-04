import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RESERVED_SUBDOMAINS = new Set(["www", "app", "api", "admin"]);

function extractSubdomain(hostname: string) {
  const host = hostname.split(":")[0].toLowerCase();

  if (host.endsWith(".localhost")) {
    const parts = host.split(".");
    if (parts.length >= 2) {
      return parts[0];
    }
    return null;
  }

  const parts = host.split(".");
  if (parts.length < 3) return null;
  return parts[0];
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/b/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const hostHeader = request.headers.get("host") || "";
  const subdomain = extractSubdomain(hostHeader);

  if (!subdomain || RESERVED_SUBDOMAINS.has(subdomain)) {
    return NextResponse.next();
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = `/b/${subdomain}`;
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
