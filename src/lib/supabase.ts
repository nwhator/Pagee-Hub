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
  path: "signup" | "token",
  body: unknown,
  queryParams?: Record<string, string>
) {
  const query = queryParams ? `?${new URLSearchParams(queryParams).toString()}` : "";
  const isTokenRequest = path === "token";
  const headers: Record<string, string> = {
    apikey: supabaseAnonKey
  };

  let requestBody: BodyInit | undefined;
  if (isTokenRequest) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    headers["Accept"] = "application/json";
    if (body && typeof body === "object" && !Array.isArray(body)) {
      const form = new URLSearchParams();
      for (const [key, value] of Object.entries(body)) {
        if (value !== undefined && value !== null) {
          form.append(key, String(value));
        }
      }
      requestBody = form.toString();
    }
  } else {
    headers["Content-Type"] = "application/json";
    headers["Authorization"] = `Bearer ${supabaseAnonKey}`;
    requestBody = JSON.stringify(body);
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/${path}${query}`, {
    method: "POST",
    headers,
    body: requestBody
  });

  const data = await response.json().catch(() => null);
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
