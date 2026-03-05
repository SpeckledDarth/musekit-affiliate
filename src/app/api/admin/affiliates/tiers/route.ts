import { NextResponse } from "next/server";
import { getTiers } from "@/lib/queries";

export async function GET() {
  const data = await getTiers();
  return NextResponse.json(data);
}
