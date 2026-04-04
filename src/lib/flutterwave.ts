export const flutterwaveConfig = {
  publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || "",
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY || "",
  webhookHash: process.env.FLUTTERWAVE_WEBHOOK_HASH || "",
  redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/billing?flutterwave=success`
};

export const hasFlutterwave = Boolean(flutterwaveConfig.secretKey && flutterwaveConfig.publicKey);

type InitPayload = {
  tx_ref: string;
  amount: number;
  currency: string;
  redirect_url: string;
  customer: {
    email: string;
    name?: string;
  };
  customizations?: {
    title?: string;
    description?: string;
    logo?: string;
  };
  meta?: Record<string, string>;
};

export async function flutterwaveInitializePayment(payload: InitPayload) {
  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${flutterwaveConfig.secretKey}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data };
}

export async function flutterwaveVerifyTransaction(transactionId: string) {
  const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${flutterwaveConfig.secretKey}`
    }
  });

  const data = await response.json().catch(() => null);
  return { ok: response.ok, status: response.status, data };
}
