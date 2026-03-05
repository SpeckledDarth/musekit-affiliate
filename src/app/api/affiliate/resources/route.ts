import { NextRequest, NextResponse } from "next/server";
import { getResources } from "@/lib/queries";
import { requireAffiliate } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAffiliate(request);
    if (auth.error) return auth.error;
    const data = await getResources();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/affiliate/resources error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
