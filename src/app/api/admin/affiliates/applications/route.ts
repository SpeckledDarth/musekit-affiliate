import { NextRequest, NextResponse } from "next/server";
import { getApplications } from "@/lib/queries";
import { updateApplicationStatus } from "@/lib/mutations";

export async function GET() {
  const data = await getApplications();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const result = await updateApplicationStatus(body.id, body.status, body.notes);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
