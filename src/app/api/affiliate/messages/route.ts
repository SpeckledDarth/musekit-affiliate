import { NextRequest, NextResponse } from "next/server";
import { getMessages, getFirstAffiliateUserId } from "@/lib/queries";
import { createMessage, markMessageRead } from "@/lib/mutations";

export async function GET() {
  const userId = await getFirstAffiliateUserId();
  if (!userId) return NextResponse.json([]);
  const data = await getMessages(userId);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const userId = await getFirstAffiliateUserId();
  if (!userId) return NextResponse.json({ error: "No affiliate found" }, { status: 404 });
  const body = await req.json();
  try {
    if (body.action === "mark_read" && body.id) {
      await markMessageRead(body.id);
      return NextResponse.json({ success: true });
    }
    const result = await createMessage({
      affiliate_user_id: userId,
      sender_id: userId,
      sender_role: "affiliate",
      body: body.body,
    });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
