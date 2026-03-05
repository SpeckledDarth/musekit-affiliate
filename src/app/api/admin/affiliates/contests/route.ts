import { NextResponse } from "next/server";
import { getContests } from "@/lib/queries";

export async function GET() {
  const data = await getContests();
  return NextResponse.json(data);
}
