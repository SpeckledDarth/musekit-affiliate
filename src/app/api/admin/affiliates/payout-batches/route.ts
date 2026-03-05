import { NextResponse } from "next/server";
import { getPayoutBatches } from "@/lib/queries";

export async function GET() {
  const data = await getPayoutBatches();
  return NextResponse.json(data);
}
