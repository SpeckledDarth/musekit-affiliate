import { NextResponse } from "next/server";
import { getMilestones } from "@/lib/queries";

export async function GET() {
  const data = await getMilestones();
  return NextResponse.json(data);
}
