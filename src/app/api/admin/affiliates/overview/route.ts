import { NextRequest, NextResponse } from "next/server";
import { getAdminAffiliateOverview } from "@/lib/queries";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;
    const data = await getAdminAffiliateOverview();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/admin/affiliates/overview error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
