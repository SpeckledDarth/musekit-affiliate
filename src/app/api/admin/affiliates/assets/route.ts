import { NextRequest, NextResponse } from "next/server";
import { getResources } from "@/lib/queries";
import { deleteAsset } from "@/lib/mutations";

export async function GET() {
  const data = await getResources();
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  try {
    await deleteAsset(id);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
