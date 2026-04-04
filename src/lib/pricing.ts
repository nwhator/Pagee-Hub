export type BillingCycle = "monthly" | "yearly";
export type PlanType = "free" | "pro";

export type FeatureLimits = {
  maxBusinessPages: number;
  maxGalleryImages: number;
  maxReviews: number;
  maxServices: number;
  canUseCustomDomain: boolean;
  canRemoveBranding: boolean;
  hasAdvancedAnalytics: boolean;
};

export type LocalizedCurrency = {
  currency: "USD" | "NGN" | "KES" | "GHS" | "ZAR";
  fxRate: number;
};

const REGION_DISCOUNTS: Record<string, number> = {
  IN: 0.6,
  NG: 0.6,
  PK: 0.6,
  BD: 0.6,
  KE: 0.7,
  GH: 0.7,
  ID: 0.7,
  PH: 0.7,
  VN: 0.7,
  BR: 0.75,
  ZA: 0.75,
  MX: 0.8
};

const CURRENCY_BY_COUNTRY: Record<string, LocalizedCurrency> = {
  NG: { currency: "NGN", fxRate: 1500 },
  KE: { currency: "KES", fxRate: 132 },
  GH: { currency: "GHS", fxRate: 15.5 },
  ZA: { currency: "ZAR", fxRate: 18.5 }
};

export const BASE_PRICING_USD = {
  monthly: 10,
  yearly: 100
} as const;

export const FIRST_PRO_MIN_MONTHS = 3;

export const PLAN_LIMITS: Record<PlanType, FeatureLimits> = {
  free: {
    maxBusinessPages: 1,
    maxGalleryImages: 3,
    maxReviews: 3,
    maxServices: 5,
    canUseCustomDomain: false,
    canRemoveBranding: false,
    hasAdvancedAnalytics: false
  },
  pro: {
    maxBusinessPages: 1,
    maxGalleryImages: 10,
    maxReviews: Number.MAX_SAFE_INTEGER,
    maxServices: Number.MAX_SAFE_INTEGER,
    canUseCustomDomain: true,
    canRemoveBranding: true,
    hasAdvancedAnalytics: true
  }
};

export function normalizeCountryCode(country?: string | null) {
  if (!country) return "US";
  const normalized = country.trim().toUpperCase();
  return normalized.length === 2 ? normalized : "US";
}

export function resolveCountryFromRequest(request: Request, billingCountry?: string) {
  const headerCountry = request.headers.get("x-vercel-ip-country") || request.headers.get("cf-ipcountry");
  return normalizeCountryCode(billingCountry || headerCountry);
}

export function getRegionMultiplier(countryCode: string) {
  return REGION_DISCOUNTS[countryCode] ?? 1;
}

export function getLocalizedPricingUsd(countryCode: string) {
  const multiplier = getRegionMultiplier(countryCode);
  const monthly = Number((BASE_PRICING_USD.monthly * multiplier).toFixed(2));
  const yearly = Number((BASE_PRICING_USD.yearly * multiplier).toFixed(2));

  return {
    countryCode,
    multiplier,
    monthly,
    yearly,
    firstProMinimumCharge: Number((monthly * FIRST_PRO_MIN_MONTHS).toFixed(2))
  };
}

export function usdToCents(value: number) {
  return Math.round(value * 100);
}

export function convertUsdToLocal(usdAmount: number, countryCode: string) {
  const currencyData = CURRENCY_BY_COUNTRY[countryCode] ?? { currency: "USD", fxRate: 1 };

  return {
    currency: currencyData.currency,
    amount: Number((usdAmount * currencyData.fxRate).toFixed(2)),
    fxRate: currencyData.fxRate
  };
}
