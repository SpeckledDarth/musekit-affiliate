import { getServiceClient } from "./supabase";

export async function updateAffiliateProfile(
  userId: string,
  updates: Record<string, unknown>,
) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "approved" | "rejected",
  reviewerNotes?: string,
) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_applications")
    .update({
      status,
      reviewer_notes: reviewerNotes || null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", applicationId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createBroadcast(broadcast: {
  subject: string;
  body: string;
  category?: string;
}) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_broadcasts")
    .insert({
      subject: broadcast.subject,
      body: broadcast.body,
      category: broadcast.category || null,
      status: "sent",
      sent_at: new Date().toISOString(),
      sent_count: 0,
      opened_count: 0,
      clicked_count: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createDiscountCode(code: {
  code: string;
  description?: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses?: number;
  expires_at?: string;
  affiliate_user_id?: string;
}) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("discount_codes")
    .insert({
      code: code.code,
      description: code.description || null,
      discount_type: code.discount_type,
      discount_value: code.discount_value,
      max_uses: code.max_uses || null,
      expires_at: code.expires_at || null,
      affiliate_user_id: code.affiliate_user_id || null,
      status: "active",
      total_uses: 0,
      total_discount_cents: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDiscountCode(
  id: string,
  updates: Record<string, unknown>,
) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("discount_codes")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDiscountCode(id: string) {
  const sb = getServiceClient();
  const { error } = await sb.from("discount_codes").delete().eq("id", id);
  if (error) throw error;
}

export async function createPayoutBatch(batch: {
  batch_date: string;
  total_affiliates: number;
  total_amount_cents: number;
  notes?: string;
}) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_payout_batches")
    .insert({
      batch_date: batch.batch_date,
      total_affiliates: batch.total_affiliates,
      total_amount_cents: batch.total_amount_cents,
      notes: batch.notes || null,
      status: "pending",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTier(
  id: string,
  updates: Record<string, unknown>,
) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_tiers")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMilestone(
  id: string,
  updates: Record<string, unknown>,
) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_milestones")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createAsset(asset: {
  title: string;
  description?: string;
  asset_type: string;
  content?: string;
  file_url?: string;
  file_name?: string;
}) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_assets")
    .insert({
      title: asset.title,
      description: asset.description || null,
      asset_type: asset.asset_type,
      content: asset.content || null,
      file_url: asset.file_url || null,
      file_name: asset.file_name || null,
      active: true,
      sort_order: 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAsset(id: string) {
  const sb = getServiceClient();
  const { error } = await sb.from("affiliate_assets").delete().eq("id", id);
  if (error) throw error;
}

export async function createContest(contest: {
  name: string;
  description?: string;
  metric: string;
  start_date: string;
  end_date: string;
  prize_description?: string;
  prize_amount_cents?: number;
}) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_contests")
    .insert({
      name: contest.name,
      description: contest.description || null,
      metric: contest.metric,
      start_date: contest.start_date,
      end_date: contest.end_date,
      prize_description: contest.prize_description || null,
      prize_amount_cents: contest.prize_amount_cents || null,
      status: "draft",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateContest(
  id: string,
  updates: Record<string, unknown>,
) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_contests")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createSupportTicket(ticket: {
  user_id: string;
  subject: string;
  description: string;
  priority?: "low" | "medium" | "high";
  category?: string;
}) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("tickets")
    .insert({
      user_id: ticket.user_id,
      subject: ticket.subject,
      description: ticket.description,
      priority: ticket.priority || "medium",
      category: ticket.category || null,
      status: "open",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createTier(tier: {
  name: string;
  min_referrals: number;
  commission_rate: number;
  min_payout_cents?: number;
  perks?: string[];
  sort_order?: number;
}) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_tiers")
    .insert({
      name: tier.name,
      min_referrals: tier.min_referrals,
      commission_rate: tier.commission_rate,
      min_payout_cents: tier.min_payout_cents || null,
      perks: tier.perks || [],
      sort_order: tier.sort_order || 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTier(id: string) {
  const sb = getServiceClient();
  const { error } = await sb.from("affiliate_tiers").delete().eq("id", id);
  if (error) throw error;
}

export async function createMilestone(milestone: {
  name: string;
  referral_threshold: number;
  bonus_amount_cents: number;
  description?: string;
  is_active?: boolean;
  sort_order?: number;
}) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_milestones")
    .insert({
      name: milestone.name,
      referral_threshold: milestone.referral_threshold,
      bonus_amount_cents: milestone.bonus_amount_cents,
      description: milestone.description || "",
      is_active: milestone.is_active !== false,
      sort_order: milestone.sort_order || 0,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMilestone(id: string) {
  const sb = getServiceClient();
  const { error } = await sb
    .from("affiliate_milestones")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function deleteContest(id: string) {
  const sb = getServiceClient();
  const { error } = await sb
    .from("affiliate_contests")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function deleteBroadcast(id: string) {
  const sb = getServiceClient();
  const { error } = await sb
    .from("affiliate_broadcasts")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function createMessage(message: {
  affiliate_user_id: string;
  sender_id: string;
  sender_role: "affiliate" | "admin";
  body: string;
}) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_messages")
    .insert({
      affiliate_user_id: message.affiliate_user_id,
      sender_id: message.sender_id,
      sender_role: message.sender_role,
      body: message.body,
      is_read: false,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function markMessageRead(id: string) {
  const sb = getServiceClient();
  const { error } = await sb
    .from("affiliate_messages")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function updateTicketStatus(
  id: string,
  status: string,
  notes?: string,
) {
  const sb = getServiceClient();
  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (status === "resolved") updates.resolved_at = new Date().toISOString();
  if (status === "closed") updates.closed_at = new Date().toISOString();
  const { data, error } = await sb
    .from("tickets")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createTicketReply(reply: {
  ticket_id: string;
  user_id: string;
  sender_role: "affiliate" | "admin";
  body: string;
}) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("ticket_replies")
    .insert({
      ticket_id: reply.ticket_id,
      user_id: reply.user_id,
      sender_role: reply.sender_role,
      body: reply.body,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAsset(
  id: string,
  updates: Record<string, unknown>,
) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_assets")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateBroadcast(
  id: string,
  updates: Record<string, unknown>,
) {
  const sb = getServiceClient();
  const { data, error } = await sb
    .from("affiliate_broadcasts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAffiliateSettings(settings: Record<string, unknown>) {
  const sb = getServiceClient();
  const { data: existing } = await sb
    .from("affiliate_settings")
    .select("id")
    .limit(1)
    .single();

  if (existing) {
    const { data, error } = await sb
      .from("affiliate_settings")
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await sb
      .from("affiliate_settings")
      .insert({ ...settings, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
