export interface AffiliateProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  legal_name: string | null;
  phone: string | null;
  website: string | null;
  bio: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  payout_method: string | null;
  payout_email: string | null;
  payout_bank_name: string | null;
  payout_bank_routing: string | null;
  payout_bank_account: string | null;
  tax_id: string | null;
  onboarded_at: string | null;
  tour_completed: boolean;
  created_at: string;
  updated_at: string;
  show_in_directory: boolean;
  quiz_results: unknown;
}

export interface ReferralLink {
  id: string;
  user_id: string;
  ref_code: string;
  clicks: number;
  signups: number;
  created_at: string;
  updated_at: string;
  is_affiliate: boolean;
  locked_commission_rate: number | null;
  locked_duration_months: number | null;
  locked_at: string | null;
  current_tier_id: string | null;
  total_earnings_cents: number;
  paid_earnings_cents: number;
  pending_earnings_cents: number;
  affiliate_role: string;
  suspended: boolean;
  suspension_reason: string | null;
  fraud_score: number;
  fraud_score_updated_at: string | null;
  recruited_by_affiliate_id: string | null;
  locked_cookie_duration_days: number | null;
  locked_min_payout_cents: number | null;
}

export interface AffiliateReferral {
  id: string;
  affiliate_user_id: string;
  referred_user_id: string;
  ref_code: string;
  ip_hash: string | null;
  status: "pending" | "converted" | "churned" | "fraud";
  fraud_flags: string[];
  converted_at: string | null;
  created_at: string;
  source_tag: string | null;
  commission_end_date: string | null;
  health_status: string | null;
  churned_at: string | null;
  churn_reason: string | null;
  last_active_at: string | null;
}

export interface AffiliateCommission {
  id: string;
  affiliate_user_id: string;
  referral_id: string;
  stripe_invoice_id: string | null;
  invoice_amount_cents: number;
  commission_rate: number;
  commission_amount_cents: number;
  status: "pending" | "approved" | "paid" | "rejected";
  created_at: string;
}

export interface AffiliatePayout {
  id: string;
  affiliate_user_id: string;
  amount_cents: number;
  method: string;
  status: "pending" | "processing" | "completed" | "failed";
  notes: string | null;
  processed_at: string | null;
  processed_by: string | null;
  created_at: string;
  batch_id: string | null;
}

export interface AffiliatePayoutBatch {
  id: string;
  batch_date: string;
  total_affiliates: number;
  total_amount_cents: number;
  status: "pending" | "processing" | "completed" | "failed";
  approved_by: string | null;
  approved_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface AffiliatePayoutItem {
  id: string;
  payout_id: string;
  commission_id: string;
  amount_cents: number;
  created_at: string;
}

export interface AffiliateTier {
  id: string;
  name: string;
  min_referrals: number;
  commission_rate: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  min_payout_cents: number | null;
  perks: string[];
}

export interface AffiliateMilestone {
  id: string;
  name: string;
  referral_threshold: number;
  bonus_amount_cents: number;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface AffiliateAsset {
  id: string;
  title: string;
  description: string | null;
  asset_type: string;
  content: string | null;
  file_url: string | null;
  file_name: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
  file_size: number | null;
  file_type: string | null;
}

export interface AffiliateBroadcast {
  id: string;
  subject: string;
  body: string;
  audience_filter: unknown;
  sent_count: number;
  opened_count: number;
  clicked_count: number;
  status: string;
  sent_at: string | null;
  sent_by: string | null;
  created_at: string;
  updated_at: string;
  category: string | null;
}

export interface AffiliateMessage {
  id: string;
  affiliate_user_id: string;
  sender_id: string;
  sender_role: "affiliate" | "admin";
  body: string;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface AffiliateApplication {
  id: string;
  name: string;
  email: string;
  website_url: string | null;
  promotion_method: string | null;
  message: string | null;
  status: "pending" | "approved" | "rejected";
  reviewer_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
  agreed_to_terms: boolean;
  terms_version: string | null;
}

export interface AffiliateContest {
  id: string;
  name: string;
  description: string | null;
  metric: string;
  start_date: string;
  end_date: string;
  prize_description: string | null;
  prize_amount_cents: number | null;
  status: "draft" | "active" | "ended";
  winner_user_id: string | null;
  winner_announced_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  duration: string | null;
  duration_months: number | null;
  max_uses: number | null;
  max_uses_per_user: number | null;
  min_plan: string | null;
  stackable: boolean;
  expires_at: string | null;
  affiliate_user_id: string | null;
  stripe_coupon_id: string | null;
  stripe_promotion_code_id: string | null;
  status: "active" | "expired" | "disabled";
  total_uses: number;
  total_discount_cents: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: string;
  target_dashboards: string[];
  is_active: boolean;
  created_by: string | null;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  assigned_to: string | null;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  category: string | null;
  ticket_number: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  closed_at: string | null;
}

export interface TicketReply {
  id: string;
  ticket_id: string;
  user_id: string;
  sender_role: "affiliate" | "admin";
  body: string;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  subscription_tier: string | null;
  created_at: string;
  updated_at: string;
  role: string;
}

export interface AffiliateStats {
  total_clicks: number;
  total_signups: number;
  total_earnings_cents: number;
  pending_earnings_cents: number;
  paid_earnings_cents: number;
  total_referrals: number;
  converted_referrals: number;
  conversion_rate: number;
  commission_count: number;
}

export interface ChartDataPoint {
  date: string;
  clicks: number;
  conversions: number;
  revenue: number;
}

export interface AdminOverview {
  total_affiliates: number;
  active_affiliates: number;
  pending_applications: number;
  total_commissions_cents: number;
  total_payouts_cents: number;
  total_referrals: number;
  total_clicks: number;
}

export interface AffiliateListItem {
  user_id: string;
  ref_code: string;
  clicks: number;
  signups: number;
  total_earnings_cents: number;
  pending_earnings_cents: number;
  locked_commission_rate: number | null;
  suspended: boolean;
  affiliate_role: string;
  created_at: string;
  profile?: Profile;
}
