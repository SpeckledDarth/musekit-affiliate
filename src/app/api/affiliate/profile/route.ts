import { NextRequest, NextResponse } from "next/server";
import { getAffiliateProfile, getFirstAffiliateUserId } from "@/lib/queries";
import { updateAffiliateProfile } from "@/lib/mutations";

export async function GET() {
  const userId = await getFirstAffiliateUserId();
  if (!userId) return NextResponse.json(null);
  const profile = await getAffiliateProfile(userId);
  return NextResponse.json(profile);
}

export async function POST(req: NextRequest) {
  const userId = await getFirstAffiliateUserId();
  if (!userId) return NextResponse.json({ error: "No affiliate found" }, { status: 404 });
  const body = await req.json();
  try {
    const updated = await updateAffiliateProfile(userId, body);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
