import { NextResponse } from "next/server";
import { getBroadcasts } from "@/lib/queries";

export async function GET() {
  const data = await getBroadcasts();
  return NextResponse.json(data);
}
