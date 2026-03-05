import { NextRequest, NextResponse } from "next/server";
import { getSupportTickets, getTicketReplies } from "@/lib/queries";
import { createSupportTicket, updateTicketStatus } from "@/lib/mutations";
import { requireAffiliate } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAffiliate(request);
    if (auth.error) return auth.error;
    const ticketId = request.nextUrl.searchParams.get("ticket_id");
    if (ticketId) {
      const replies = await getTicketReplies(ticketId);
      return NextResponse.json(replies);
    }
    const data = await getSupportTickets(auth.userId);
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/affiliate/support-tickets error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAffiliate(request);
    if (auth.error) return auth.error;
    const body = await request.json();
    if (body.action === "update_status" && body.id) {
      const result = await updateTicketStatus(body.id, body.status);
      return NextResponse.json(result);
    }
    if (body.action === "add_reply" && body.ticket_id) {
      const { createTicketReply } = await import("@/lib/mutations");
      const reply = await createTicketReply({
        ticket_id: body.ticket_id,
        user_id: auth.userId,
        sender_role: "affiliate",
        body: body.body,
      });
      return NextResponse.json(reply);
    }
    if (body.action === "get_replies" && body.ticket_id) {
      const { getTicketReplies } = await import("@/lib/queries");
      const replies = await getTicketReplies(body.ticket_id);
      return NextResponse.json(replies);
    }
    const ticket = await createSupportTicket({ ...body, user_id: auth.userId });
    return NextResponse.json(ticket);
  } catch (error) {
    console.error("POST /api/affiliate/support-tickets error:", error);
    const message = error instanceof Error ? error.message : "Failed to create ticket";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
