import { NextResponse } from "next/server";
import { getAdminAffiliateList } from "@/lib/queries";

export async function GET() {
  const data = await getAdminAffiliateList();
  return NextResponse.json(data);
}
