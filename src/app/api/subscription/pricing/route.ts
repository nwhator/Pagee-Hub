import { NextResponse } from "next/server";
import { BASE_PRICING_USD, getLocalizedPricingUsd, normalizeCountryCode, resolveCountryFromRequest } from "@/lib/pricing";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const countryParam = url.searchParams.get("country");
  const countryCode = countryParam
    ? normalizeCountryCode(countryParam)
    : resolveCountryFromRequest(request);

  const localized = getLocalizedPricingUsd(countryCode);

  return NextResponse.json({
    baseUsd: BASE_PRICING_USD,
    localized,
    note: "Localized pricing is optional and keeps USD as the source reference."
  });
}
