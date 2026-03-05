import { NextRequest, NextResponse } from "next/server";
import { getResources } from "@/lib/queries";
import { createAsset, updateAsset, deleteAsset } from "@/lib/mutations";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;
    const data = await getResources();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/admin/affiliates/assets error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;
    const body = await request.json();
    const result = await createAsset(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/admin/affiliates/assets error:", error);
    const message = error instanceof Error ? error.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;
    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    const result = await updateAsset(id, updates);
    return NextResponse.json(result);
  } catch (error) {
    console.error("PUT /api/admin/affiliates/assets error:", error);
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);
    if (auth.error) return auth.error;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    await deleteAsset(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/affiliates/assets error:", error);
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
