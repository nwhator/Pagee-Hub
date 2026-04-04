import { PLAN_LIMITS, type FeatureLimits, type PlanType } from "@/lib/pricing";
import { hasSupabaseEnv, supabaseRest } from "@/lib/supabase";

type SubscriptionRecord = {
  id: string;
  user_id: string;
  plan: PlanType;
  billing_cycle: "monthly" | "yearly";
  status: "active" | "canceled" | "past_due";
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

export function parseUserIdFromRequest(request: Request) {
  const userId = request.headers.get("x-user-id") || "";
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(userId) ? userId : null;
}

export function isProEntitlement(subscription?: SubscriptionRecord | null) {
  if (!subscription) return false;
  if (subscription.plan !== "pro") return false;
  if (subscription.status === "active" || subscription.status === "past_due") return true;

  if (subscription.status === "canceled" && subscription.current_period_end) {
    return new Date(subscription.current_period_end).getTime() > Date.now();
  }

  return false;
}

export async function getSubscriptionByUserId(userId: string) {
  if (!hasSupabaseEnv) {
    return null;
  }

  const result = await supabaseRest("Subscriptions", {
    method: "GET",
    useServiceRole: true,
    query: `user_id=eq.${userId}&order=created_at.desc&limit=1`
  });

  if (!result.ok) {
    return null;
  }

  return (result.data?.[0] ?? null) as SubscriptionRecord | null;
}

export async function getPlanForUser(userId: string): Promise<PlanType> {
  const subscription = await getSubscriptionByUserId(userId);
  return isProEntitlement(subscription) ? "pro" : "free";
}

export async function getFeatureLimitsForUser(userId: string): Promise<FeatureLimits> {
  const plan = await getPlanForUser(userId);
  return PLAN_LIMITS[plan];
}
