import { NextResponse } from "next/server";
import { getPayouts, getFirstAffiliateUserId } from "@/lib/queries";

export async function GET() {
  const userId = await getFirstAffiliateUserId();
  if (!userId) return NextResponse.json([]);
  const data = await getPayouts(userId);
  return NextResponse.json(data);
}
