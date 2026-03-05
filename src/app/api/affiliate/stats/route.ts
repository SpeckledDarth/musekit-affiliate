import { NextResponse } from "next/server";
import { getAffiliateDashboardStats, getFirstAffiliateUserId } from "@/lib/queries";

export async function GET() {
  const userId = await getFirstAffiliateUserId();
  if (!userId) return NextResponse.json({ total_clicks: 0, total_signups: 0, total_earnings_cents: 0, pending_earnings_cents: 0, paid_earnings_cents: 0, total_referrals: 0, converted_referrals: 0, conversion_rate: 0, commission_count: 0 });
  const stats = await getAffiliateDashboardStats(userId);
  return NextResponse.json(stats);
}
