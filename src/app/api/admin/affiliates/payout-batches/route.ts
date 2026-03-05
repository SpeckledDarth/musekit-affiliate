import { NextRequest, NextResponse } from "next/server";
import { getPayoutBatches } from "@/lib/queries";
import { createPayoutBatch } from "@/lib/mutations";

export async function GET() {
  const data = await getPayoutBatches();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const result = await createPayoutBatch(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
