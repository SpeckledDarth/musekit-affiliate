import { supabase, getServiceClient } from "./supabase";
import type {
  AffiliateProfile,
  ReferralLink,
  AffiliateReferral,
  AffiliateCommission,
  AffiliatePayout,
  AffiliatePayoutBatch,
  AffiliateTier,
  AffiliateMilestone,
  AffiliateAsset,
  AffiliateBroadcast,
  AffiliateMessage,
  AffiliateApplication,
  AffiliateContest,
  DiscountCode,
  Announcement,
  SupportTicket,
  AffiliateStats,
  AdminOverview,
  AffiliateListItem,
  Profile,
} from "@/types";

export async function getAffiliateProfile(
  userId: string,
): Promise<AffiliateProfile | null> {
  const { data, error } = await supabase
    .from("affiliate_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function getReferralLinks(
  userId: string,
): Promise<ReferralLink[]> {
  const { data, error } = await supabase
    .from("referral_links")
    .select("*")
    .eq("user_id", userId)
    .eq("is_affiliate", true);
  if (error) return [];
  return data || [];
}

export async function getAffiliateDashboardStats(
  userId: string,
): Promise<AffiliateStats> {
  const [linksRes, referralsRes, commissionsRes] = await Promise.all([
    supabase
      .from("referral_links")
      .select("clicks, signups, total_earnings_cents, pending_earnings_cents, paid_earnings_cents")
      .eq("user_id", userId)
      .eq("is_affiliate", true),
    supabase
      .from("affiliate_referrals")
      .select("id, status")
      .eq("affiliate_user_id", userId),
    supabase
      .from("affiliate_commissions")
      .select("id")
      .eq("affiliate_user_id", userId),
  ]);

  const links = linksRes.data || [];
  const referrals = referralsRes.data || [];
  const commissions = commissionsRes.data || [];

  const total_clicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);
  const total_signups = links.reduce((sum, l) => sum + (l.signups || 0), 0);
  const total_earnings_cents = links.reduce(
    (sum, l) => sum + (l.total_earnings_cents || 0),
    0,
  );
  const pending_earnings_cents = links.reduce(
    (sum, l) => sum + (l.pending_earnings_cents || 0),
    0,
  );
  const paid_earnings_cents = links.reduce(
    (sum, l) => sum + (l.paid_earnings_cents || 0),
    0,
  );
  const total_referrals = referrals.length;
  const converted_referrals = referrals.filter(
    (r) => r.status === "converted",
  ).length;
  const conversion_rate =
    total_referrals > 0
      ? Math.round((converted_referrals / total_referrals) * 10000) / 100
      : 0;

  return {
    total_clicks,
    total_signups,
    total_earnings_cents,
    pending_earnings_cents,
    paid_earnings_cents,
    total_referrals,
    converted_referrals,
    conversion_rate,
    commission_count: commissions.length,
  };
}

export async function getReferrals(
  userId: string,
): Promise<AffiliateReferral[]> {
  const { data, error } = await supabase
    .from("affiliate_referrals")
    .select("*")
    .eq("affiliate_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getCommissions(
  userId: string,
): Promise<AffiliateCommission[]> {
  const { data, error } = await supabase
    .from("affiliate_commissions")
    .select("*")
    .eq("affiliate_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getPayouts(userId: string): Promise<AffiliatePayout[]> {
  const { data, error } = await supabase
    .from("affiliate_payouts")
    .select("*")
    .eq("affiliate_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getResources(): Promise<AffiliateAsset[]> {
  const { data, error } = await supabase
    .from("affiliate_assets")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getMessages(
  userId: string,
): Promise<AffiliateMessage[]> {
  const { data, error } = await supabase
    .from("affiliate_messages")
    .select("*")
    .eq("affiliate_user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getBroadcasts(): Promise<AffiliateBroadcast[]> {
  const { data, error } = await supabase
    .from("affiliate_broadcasts")
    .select("*")
    .eq("status", "sent")
    .order("sent_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getSupportTickets(
  userId: string,
): Promise<SupportTicket[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getTicketReplies(ticketId: string): Promise<import("@/types").TicketReply[]> {
  const { data, error } = await supabase
    .from("ticket_replies")
    .select("*")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getTiers(): Promise<AffiliateTier[]> {
  const { data, error } = await supabase
    .from("affiliate_tiers")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getMilestones(): Promise<AffiliateMilestone[]> {
  const { data, error } = await supabase
    .from("affiliate_milestones")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data || [];
}

export async function getAdminAffiliateOverview(): Promise<AdminOverview> {
  const sb = getServiceClient();
  const [linksRes, appsRes, commissionsRes, payoutsRes, referralsRes] =
    await Promise.all([
      sb
        .from("referral_links")
        .select("id, is_affiliate, clicks, suspended")
        .eq("is_affiliate", true),
      sb
        .from("affiliate_applications")
        .select("id, status")
        .eq("status", "pending"),
      sb.from("affiliate_commissions").select("commission_amount_cents"),
      sb.from("affiliate_payouts").select("amount_cents").eq("status", "completed"),
      sb.from("affiliate_referrals").select("id"),
    ]);

  const links = linksRes.data || [];
  const activeLinks = links.filter((l) => !l.suspended);
  const totalCommissionsCents = (commissionsRes.data || []).reduce(
    (sum, c) => sum + (c.commission_amount_cents || 0),
    0,
  );
  const totalPayoutsCents = (payoutsRes.data || []).reduce(
    (sum, p) => sum + (p.amount_cents || 0),
    0,
  );
  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0);

  return {
    total_affiliates: links.length,
    active_affiliates: activeLinks.length,
    pending_applications: (appsRes.data || []).length,
    total_commissions_cents: totalCommissionsCents,
    total_payouts_cents: totalPayoutsCents,
    total_referrals: (referralsRes.data || []).length,
    total_clicks: totalClicks,
  };
}

export async function getAdminAffiliateList(): Promise<AffiliateListItem[]> {
  const sb = getServiceClient();
  const { data: links, error } = await sb
    .from("referral_links")
    .select("*")
    .eq("is_affiliate", true)
    .order("total_earnings_cents", { ascending: false });
  if (error || !links) return [];

  const userIds = links.map((l) => l.user_id);
  const { data: profiles } = await sb
    .from("profiles")
    .select("*")
    .in("id", userIds);
  const profileMap = new Map(
    (profiles || []).map((p: Profile) => [p.id, p]),
  );

  return links.map((l) => ({
    user_id: l.user_id,
    ref_code: l.ref_code,
    clicks: l.clicks,
    signups: l.signups,
    total_earnings_cents: l.total_earnings_cents,
    pending_earnings_cents: l.pending_earnings_cents,
    locked_commission_rate: l.locked_commission_rate,
    suspended: l.suspended,
    affiliate_role: l.affiliate_role,
    created_at: l.created_at,
    profile: profileMap.get(l.user_id) || undefined,
  }));
}

export async function getApplications(): Promise<AffiliateApplication[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getAdminBroadcasts(): Promise<AffiliateBroadcast[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_broadcasts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getContests(): Promise<AffiliateContest[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_contests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getDiscountCodes(): Promise<DiscountCode[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("discount_codes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getPayoutBatches(): Promise<AffiliatePayoutBatch[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_payout_batches")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getAllReferralLinks(): Promise<ReferralLink[]> {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("referral_links")
    .select("*")
    .eq("is_affiliate", true)
    .order("total_earnings_cents", { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getFirstAffiliateUserId(): Promise<string | null> {
  const sb = getServiceClient();
  const { data } = await sb
    .from("referral_links")
    .select("user_id")
    .eq("is_affiliate", true)
    .limit(1)
    .single();
  return data?.user_id || null;
}

export async function getAffiliateSettings() {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_settings")
    .select("*")
    .limit(1)
    .single();
  if (error || !data) {
    return {
      commission_rate: 15,
      cookie_duration: 30,
      min_payout_amount: 50,
      payout_schedule: "monthly",
      auto_approve: false,
      require_email_verification: true,
    };
  }
  return data;
}
