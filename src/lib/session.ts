import { NextResponse } from "next/server";

export const sessionCookieName = "pagee_session";

type AuthResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  user?: {
    id?: string;
    email?: string;
  };
};

export function withAuthCookies(response: NextResponse, auth: AuthResponse) {
  if (!auth.access_token) {
    return response;
  }

  const maxAge = typeof auth.expires_in === "number" ? auth.expires_in : 60 * 60;

  response.cookies.set(sessionCookieName, auth.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge
  });

  if (auth.refresh_token) {
    response.cookies.set(`${sessionCookieName}_refresh`, auth.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30
    });
  }

  if (auth.user?.id) {
    response.cookies.set("pagee_uid", auth.user.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge
    });
  }

  return response;
}

export function clearAuthCookies(response: NextResponse) {
  response.cookies.set(sessionCookieName, "", { path: "/", maxAge: 0 });
  response.cookies.set(`${sessionCookieName}_refresh`, "", { path: "/", maxAge: 0 });
  response.cookies.set("pagee_uid", "", { path: "/", maxAge: 0 });
  return response;
}
