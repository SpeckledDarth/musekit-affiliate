import { NextRequest, NextResponse } from "next/server";
import { getAdminAffiliateList } from "@/lib/queries";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;
    const data = await getAdminAffiliateList();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/admin/affiliates/list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
