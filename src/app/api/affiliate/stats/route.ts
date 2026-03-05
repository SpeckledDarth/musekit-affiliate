import { NextRequest, NextResponse } from "next/server";
import { getAffiliateDashboardStats } from "@/lib/queries";
import { requireAffiliate } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAffiliate(request);
    if (auth.error) return auth.error;
    const stats = await getAffiliateDashboardStats(auth.userId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET /api/affiliate/stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
