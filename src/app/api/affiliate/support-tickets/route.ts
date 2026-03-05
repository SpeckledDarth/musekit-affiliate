import { NextRequest, NextResponse } from "next/server";
import { getSupportTickets, getFirstAffiliateUserId } from "@/lib/queries";
import { createSupportTicket, updateTicketStatus } from "@/lib/mutations";

export async function GET() {
  const userId = await getFirstAffiliateUserId();
  if (!userId) return NextResponse.json([]);
  const data = await getSupportTickets(userId);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const userId = await getFirstAffiliateUserId();
  if (!userId) return NextResponse.json({ error: "No affiliate found" }, { status: 404 });
  const body = await req.json();
  try {
    if (body.action === "update_status" && body.id) {
      const result = await updateTicketStatus(body.id, body.status);
      return NextResponse.json(result);
    }
    const ticket = await createSupportTicket({ ...body, user_id: userId });
    return NextResponse.json(ticket);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create ticket";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
