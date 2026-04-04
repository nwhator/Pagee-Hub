import Stripe from "stripe";

export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY || "",
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  proMonthlyPriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
  proYearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
};

export const hasStripe = Boolean(stripeConfig.secretKey);

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!stripeConfig.secretKey) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(stripeConfig.secretKey);
  }

  return stripeClient;
}
