import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getServiceClient } from "./supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

type AuthResult = {
  userId: string;
  error?: never;
} | {
  userId?: never;
  error: NextResponse;
};

type AdminResult = {
  userId: string;
  error?: never;
} | {
  userId?: never;
  error: NextResponse;
};

function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return null;
}

async function getUserIdFromToken(token: string): Promise<string | null> {
  const client = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data: { user }, error } = await client.auth.getUser(token);
  if (error || !user) return null;
  return user.id;
}

async function getDevFallbackUserId(): Promise<string | null> {
  if (process.env.NODE_ENV !== "development") return null;
  const sb = getServiceClient();
  const { data } = await sb
    .from("referral_links")
    .select("user_id")
    .eq("is_affiliate", true)
    .limit(1)
    .single();
  return data?.user_id || null;
}

export async function requireAffiliate(request: NextRequest): Promise<AuthResult> {
  const token = getTokenFromRequest(request);

  if (token) {
    const userId = await getUserIdFromToken(token);
    if (userId) return { userId };
    return { error: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }) };
  }

  const fallbackId = await getDevFallbackUserId();
  if (fallbackId) return { userId: fallbackId };

  return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
}

export async function requireAdmin(request: NextRequest): Promise<AdminResult> {
  const token = getTokenFromRequest(request);

  if (token) {
    const userId = await getUserIdFromToken(token);
    if (!userId) {
      return { error: NextResponse.json({ error: "Invalid or expired token" }, { status: 401 }) };
    }

    const sb = getServiceClient();
    const { data: profile } = await sb
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (!profile || profile.role !== "admin") {
      return { error: NextResponse.json({ error: "Admin access required" }, { status: 403 }) };
    }

    return { userId };
  }

  if (process.env.NODE_ENV === "development") {
    return { userId: "dev-admin" };
  }

  return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) };
}
