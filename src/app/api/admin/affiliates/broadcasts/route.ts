import { NextRequest, NextResponse } from "next/server";
import { getAdminBroadcasts } from "@/lib/queries";
import { createBroadcast, updateBroadcast, deleteBroadcast } from "@/lib/mutations";

export async function GET() {
  const data = await getAdminBroadcasts();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const result = await createBroadcast(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  try {
    const result = await updateBroadcast(id, updates);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  try {
    await deleteBroadcast(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
