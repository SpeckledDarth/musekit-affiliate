import { NextRequest, NextResponse } from "next/server";
import { getAffiliateProfile } from "@/lib/queries";
import { updateAffiliateProfile } from "@/lib/mutations";
import { requireAffiliate } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAffiliate(request);
    if (auth.error) return auth.error;
    const profile = await getAffiliateProfile(auth.userId);
    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/affiliate/profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAffiliate(request);
    if (auth.error) return auth.error;
    const body = await request.json();
    const updated = await updateAffiliateProfile(auth.userId, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("POST /api/affiliate/profile error:", error);
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
