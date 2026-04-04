type Result<T> = { success: true; data: T } | { success: false; error: string };

type BusinessService = { name: string; price: string; description?: string };

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function validateAuth(input: unknown): Result<{ email: string; password: string }> {
  if (!isObject(input)) return { success: false, error: "Invalid payload" };
  const email = asString(input.email).trim();
  const password = asString(input.password);
  if (!email.includes("@")) return { success: false, error: "Invalid email" };
  if (password.length < 8) return { success: false, error: "Password must be at least 8 characters" };
  return { success: true, data: { email, password } };
}

export function validateBusiness(input: unknown, requireId = false): Result<{
  id?: string;
  subdomain: string;
  custom_domain: string;
  name: string;
  tagline: string;
  whatsapp: string;
  phone: string;
  instagram: string;
  about: string;
  services: BusinessService[];
  show_branding: boolean;
  brand_color: string;
  accent_color: string;
  logo_url: string;
  media_urls: string[];
}> {
  if (!isObject(input)) return { success: false, error: "Invalid payload" };

  const id = asString(input.id);
  if (requireId && !uuidRegex.test(id)) return { success: false, error: "Valid id is required" };

  const subdomain = asString(input.subdomain).trim();
  const name = asString(input.name).trim();
  if (subdomain.length < 2) return { success: false, error: "Subdomain must be at least 2 chars" };
  if (name.length < 2) return { success: false, error: "Name must be at least 2 chars" };

  const services = Array.isArray(input.services)
    ? input.services
        .filter(isObject)
        .map((service) => ({
          name: asString(service.name),
          price: asString(service.price),
          description: asString(service.description)
        }))
        .filter((service) => service.name && service.price)
    : [];

  return {
    success: true,
    data: {
      id: id || undefined,
      subdomain,
      custom_domain: asString(input.custom_domain).trim(),
      name,
      tagline: asString(input.tagline),
      whatsapp: asString(input.whatsapp),
      phone: asString(input.phone),
      instagram: asString(input.instagram),
      about: asString(input.about),
      services,
      show_branding: input.show_branding !== false,
      brand_color: asString(input.brand_color, "#22C55E"),
      accent_color: asString(input.accent_color, "#16A34A"),
      logo_url: asString(input.logo_url),
      media_urls: Array.isArray(input.media_urls) ? input.media_urls.filter((item): item is string => typeof item === "string") : []
    }
  };
}

export function validateReview(input: unknown, requireId = false): Result<{
  id?: string;
  business_id: string;
  user_name: string;
  rating: number;
  comment: string;
}> {
  if (!isObject(input)) return { success: false, error: "Invalid payload" };
  const id = asString(input.id);
  const business_id = asString(input.business_id);
  const user_name = asString(input.user_name);
  const rating = Number(input.rating ?? 0);
  const comment = asString(input.comment);

  if (requireId && !uuidRegex.test(id)) return { success: false, error: "Valid id is required" };
  if (!uuidRegex.test(business_id)) return { success: false, error: "Valid business_id is required" };
  if (!user_name) return { success: false, error: "user_name is required" };
  if (rating < 1 || rating > 5) return { success: false, error: "rating must be 1-5" };
  if (!comment) return { success: false, error: "comment is required" };

  return { success: true, data: { id: id || undefined, business_id, user_name, rating, comment } };
}

export function validateAnalytics(input: unknown): Result<{ business_id: string; event_type: string; source: string }> {
  if (!isObject(input)) return { success: false, error: "Invalid payload" };
  const business_id = asString(input.business_id);
  const event_type = asString(input.event_type);
  const source = asString(input.source, "direct");
  if (!uuidRegex.test(business_id)) return { success: false, error: "Valid business_id is required" };
  if (!event_type) return { success: false, error: "event_type is required" };
  return { success: true, data: { business_id, event_type, source } };
}

export function validateSubscription(input: unknown): Result<{
  user_id: string;
  plan: "pro";
  billing_cycle: "monthly" | "yearly";
  email?: string;
  billing_country?: string;
}> {
  if (!isObject(input)) return { success: false, error: "Invalid payload" };
  const user_id = asString(input.user_id);
  const plan = asString(input.plan) as "pro";
  const billing_cycle = asString(input.billing_cycle) as "monthly" | "yearly";
  const email = asString(input.email);
  const billing_country = asString(input.billing_country);

  if (!uuidRegex.test(user_id)) return { success: false, error: "Valid user_id is required" };
  if (plan !== "pro") return { success: false, error: "Only pro plan can be purchased" };
  if (!["monthly", "yearly"].includes(billing_cycle)) return { success: false, error: "Invalid billing_cycle" };
  return { success: true, data: { user_id, plan, billing_cycle, email: email || undefined, billing_country: billing_country || undefined } };
}

export function validateId(input: unknown): Result<{ id: string }> {
  if (!isObject(input)) return { success: false, error: "Invalid payload" };
  const id = asString(input.id);
  if (!uuidRegex.test(id)) return { success: false, error: "Valid id is required" };
  return { success: true, data: { id } };
}

export function validateSubscriptionUpdate(input: unknown): Result<{ id: string; plan: "free" | "pro"; billing_cycle?: "monthly" | "yearly" }> {
  if (!isObject(input)) return { success: false, error: "Invalid payload" };
  const id = asString(input.id);
  const plan = asString(input.plan) as "free" | "pro";
  const billing_cycle = asString(input.billing_cycle) as "monthly" | "yearly";
  if (!uuidRegex.test(id)) return { success: false, error: "Valid id is required" };
  if (!["free", "pro"].includes(plan)) return { success: false, error: "Invalid plan" };
  if (billing_cycle && !["monthly", "yearly"].includes(billing_cycle)) return { success: false, error: "Invalid billing_cycle" };
  return { success: true, data: { id, plan, billing_cycle: billing_cycle || undefined } };
}

export function validateSubscriptionCancel(input: unknown): Result<{ id: string }> {
  if (!isObject(input)) return { success: false, error: "Invalid payload" };
  const id = asString(input.id);
  if (!uuidRegex.test(id)) return { success: false, error: "Valid id is required" };
  return { success: true, data: { id } };
}
