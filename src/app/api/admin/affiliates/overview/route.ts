import { NextResponse } from "next/server";
import { getAdminAffiliateOverview } from "@/lib/queries";

export async function GET() {
  const data = await getAdminAffiliateOverview();
  return NextResponse.json(data);
}
