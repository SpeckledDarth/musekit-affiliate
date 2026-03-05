import { NextResponse } from "next/server";
import { getReferralLinks, getFirstAffiliateUserId } from "@/lib/queries";

export async function GET() {
  const userId = await getFirstAffiliateUserId();
  if (!userId) return NextResponse.json([]);
  const data = await getReferralLinks(userId);
  return NextResponse.json(data);
}
