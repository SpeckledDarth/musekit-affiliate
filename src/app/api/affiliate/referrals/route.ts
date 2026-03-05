import { NextResponse } from "next/server";
import { getReferrals, getFirstAffiliateUserId } from "@/lib/queries";

export async function GET() {
  const userId = await getFirstAffiliateUserId();
  if (!userId) return NextResponse.json([]);
  const data = await getReferrals(userId);
  return NextResponse.json(data);
}
