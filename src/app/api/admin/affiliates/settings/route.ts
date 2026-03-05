import { NextRequest, NextResponse } from "next/server";
import { getAffiliateSettings } from "@/lib/queries";
import { updateAffiliateSettings } from "@/lib/mutations";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;
    const data = await getAffiliateSettings();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/admin/affiliates/settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;
    const body = await request.json();
    const result = await updateAffiliateSettings(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/admin/affiliates/settings error:", error);
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
