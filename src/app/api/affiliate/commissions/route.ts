import { NextRequest, NextResponse } from "next/server";
import { getCommissions } from "@/lib/queries";
import { requireAffiliate } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAffiliate(request);
    if (auth.error) return auth.error;
    const data = await getCommissions(auth.userId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/affiliate/commissions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
