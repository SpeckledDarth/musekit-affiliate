import { NextResponse } from "next/server";
import { getMessages, getFirstAffiliateUserId } from "@/lib/queries";

export async function GET() {
  const userId = await getFirstAffiliateUserId();
  if (!userId) return NextResponse.json([]);
  const data = await getMessages(userId);
  return NextResponse.json(data);
}
