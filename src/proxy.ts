import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const RESERVED_SUBDOMAINS = new Set(["www", "app", "api", "admin"]);
const protectedPathPrefixes = [
  "/dashboard",
  "/template-library",
  "/analytics",
  "/reviews",
  "/plans",
  "/billing",
  "/profile",
  "/support",
  "/onboarding",
  "/admin"
];

function extractSubdomain(hostname: string, rootDomain: string) {
  const host = hostname.split(":")[0].toLowerCase();

  if (host.endsWith(".localhost")) {
    const parts = host.split(".");
    if (parts.length >= 2) {
      return parts[0];
    }
    return null;
  }

  if (host.endsWith(".vercel.app")) {
    return null;
  }

  if (!rootDomain) {
    return null;
  }

  if (host === rootDomain || host === `www.${rootDomain}`) {
    return null;
  }

  if (!host.endsWith(`.${rootDomain}`)) {
    return null;
  }

  const subdomainPart = host.slice(0, -(rootDomain.length + 1));
  if (!subdomainPart) {
    return null;
  }

  return subdomainPart.includes(".") ? subdomainPart.split(".")[0] : subdomainPart;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/b/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const requiresAuth = protectedPathPrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  if (requiresAuth) {
    const session = request.cookies.get("pagee_session")?.value;
    if (!session) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.search = "";
      loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  const hostHeader = request.headers.get("host") || "";
  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "pagee.hub").toLowerCase();
  const subdomain = extractSubdomain(hostHeader, rootDomain);

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
