import { NextRequest, NextResponse } from "next/server";
import { getMessages } from "@/lib/queries";
import { createMessage, markMessageRead } from "@/lib/mutations";
import { requireAffiliate } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAffiliate(request);
    if (auth.error) return auth.error;
    const data = await getMessages(auth.userId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/affiliate/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAffiliate(request);
    if (auth.error) return auth.error;
    const body = await request.json();
    if (body.action === "mark_read" && body.id) {
      await markMessageRead(body.id);
      return NextResponse.json({ success: true });
    }
    const result = await createMessage({
      affiliate_user_id: auth.userId,
      sender_id: auth.userId,
      sender_role: "affiliate",
      body: body.body,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/affiliate/messages error:", error);
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
