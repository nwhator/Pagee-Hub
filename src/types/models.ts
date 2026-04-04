export type PlanType = "free" | "pro";
export type BillingCycle = "monthly" | "yearly";

export interface BusinessPage {
  id: string;
  user_id: string;
  subdomain: string;
  custom_domain: string | null;
  name: string;
  tagline: string | null;
  whatsapp: string | null;
  phone: string | null;
  instagram: string | null;
  about: string | null;
  services: { name: string; price: string; description?: string }[];
  show_branding: boolean;
  brand_color: string;
  logo_url: string | null;
  media_urls: string[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  business_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  business_id: string;
  event_type: string;
  source: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: PlanType;
  billing_cycle: BillingCycle;
  status: "active" | "canceled" | "past_due";
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  created_at: string;
}
