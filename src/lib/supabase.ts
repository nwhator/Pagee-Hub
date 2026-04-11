const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: string;
  useServiceRole?: boolean;
};

export async function supabaseRest(table: string, options: RequestOptions = {}) {
  const method = options.method ?? "GET";
  const query = options.query ? `?${options.query}` : "";
  const key = options.useServiceRole ? serviceRoleKey : supabaseAnonKey;

  const response = await fetch(`${supabaseUrl}/rest/v1/${table}${query}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: "return=representation"
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data };
}

export async function supabaseAuth(
  path: "signup",
  body: unknown,
  queryParams?: Record<string, string>
) {
  const query = queryParams ? `?${new URLSearchParams(queryParams).toString()}` : "";
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`
  };

  const response = await fetch(`${supabaseUrl}/auth/v1/${path}${query}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data };
}

export async function supabaseTokenLogin(email: string, password: string) {
  const params = new URLSearchParams({
    grant_type: "password",
    email,
    password
  });

  const response = await fetch(`${supabaseUrl}/auth/v1/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`
    },
    body: params
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    console.error("Supabase token login failed", {
      status: response.status,
      headers: response.headers.get("content-type"),
      body: params.toString(),
      data
    });
  }

  return { ok: response.ok, status: response.status, data };
}

export async function supabaseAuthRequest(path: string, options?: { method?: "GET" | "POST" | "PUT"; body?: unknown; accessToken?: string }) {
  const response = await fetch(`${supabaseUrl}/auth/v1/${path}`, {
    method: options?.method ?? "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      ...(options?.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {})
    },
    body: options?.body ? JSON.stringify(options.body) : undefined
  });

  const data = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data };
}

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseAnonKey);
