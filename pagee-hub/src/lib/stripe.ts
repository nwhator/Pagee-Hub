export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY || "",
  proPriceId: process.env.STRIPE_PRO_PRICE_ID || "",
  enterprisePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || ""
};

export const hasStripe = Boolean(stripeConfig.secretKey);
