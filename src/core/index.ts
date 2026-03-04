import type { AffiliateTier } from "@/types";

const TIER_RATES: Record<string, number> = {
  bronze: 0.15,
  silver: 0.20,
  gold: 0.25,
  platinum: 0.30,
};

export function trackReferral(referralCode: string, visitorId: string) {
  return {
    id: `ref_${Date.now()}`,
    referral_code: referralCode,
    visitor_id: visitorId,
    clicked_at: new Date().toISOString(),
    converted: false,
    converted_at: null,
    converted_user_id: null,
  };
}

export function attributeConversion(userId: string, referralCode: string) {
  return {
    user_id: userId,
    referral_code: referralCode,
    attributed_at: new Date().toISOString(),
    status: "pending" as const,
  };
}

export function calculateCommission(
  saleAmount: number,
  affiliateTier: AffiliateTier["slug"],
): number {
  const rate = TIER_RATES[affiliateTier] ?? 0.15;
  return Math.round(saleAmount * rate * 100) / 100;
}

export function processPayoutRun(affiliateIds: string[]) {
  return {
    id: `pr_${Date.now()}`,
    affiliate_ids: affiliateIds,
    affiliate_count: affiliateIds.length,
    status: "pending" as const,
    created_at: new Date().toISOString(),
  };
}

export function generateReferralLink(
  affiliateId: string,
  campaign?: string,
): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://musekit.io";
  const params = new URLSearchParams({ ref: affiliateId });
  if (campaign) params.set("utm_campaign", campaign);
  return `${baseUrl}?${params.toString()}`;
}

export function validateReferralCode(code: string): {
  valid: boolean;
  reason?: string;
} {
  if (!code || code.length < 3) {
    return { valid: false, reason: "Code must be at least 3 characters" };
  }
  if (!/^[A-Za-z0-9_-]+$/.test(code)) {
    return {
      valid: false,
      reason: "Code can only contain letters, numbers, hyphens, and underscores",
    };
  }
  return { valid: true };
}
