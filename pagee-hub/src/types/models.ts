export type PlanType = "free" | "pro" | "enterprise";

export interface BusinessPage {
  id: string;
  user_id: string;
  subdomain: string;
  name: string;
  tagline: string | null;
  whatsapp: string | null;
  phone: string | null;
  instagram: string | null;
  about: string | null;
  services: { name: string; price: string; description?: string }[];
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
  plan_type: PlanType;
  status: string;
  stripe_id: string;
  created_at: string;
  updated_at: string;
}
