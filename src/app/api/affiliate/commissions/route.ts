import { NextResponse } from "next/server";
import { getCommissions, getFirstAffiliateUserId } from "@/lib/queries";

export async function GET() {
  const userId = await getFirstAffiliateUserId();
  if (!userId) return NextResponse.json([]);
  const data = await getCommissions(userId);
  return NextResponse.json(data);
}
