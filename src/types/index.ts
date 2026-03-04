export interface Affiliate {
  id: string;
  user_id: string;
  name: string;
  email: string;
  referral_code: string;
  tier: "bronze" | "silver" | "gold" | "platinum";
  status: "pending" | "active" | "suspended" | "rejected";
  commission_rate: number;
  total_earnings: number;
  pending_earnings: number;
  total_clicks: number;
  total_conversions: number;
  payment_method: string | null;
  payment_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface Referral {
  id: string;
  affiliate_id: string;
  visitor_id: string;
  referral_code: string;
  ip_address: string | null;
  user_agent: string | null;
  landing_page: string | null;
  clicked_at: string;
  converted: boolean;
  converted_at: string | null;
  converted_user_id: string | null;
}

export interface Conversion {
  id: string;
  affiliate_id: string;
  referral_id: string;
  user_id: string;
  sale_amount: number;
  commission_amount: number;
  status: "pending" | "approved" | "rejected" | "paid";
  created_at: string;
}

export interface Payout {
  id: string;
  affiliate_id: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "failed";
  payment_method: string;
  transaction_id: string | null;
  processed_at: string | null;
  created_at: string;
}

export interface PayoutRun {
  id: string;
  total_amount: number;
  affiliate_count: number;
  status: "pending" | "processing" | "completed" | "failed";
  processed_by: string;
  created_at: string;
  completed_at: string | null;
}

export interface MarketingAsset {
  id: string;
  name: string;
  type: "banner" | "text" | "email" | "social";
  content: string;
  preview_url: string | null;
  dimensions: string | null;
  created_at: string;
}

export interface AffiliateTier {
  id: string;
  name: string;
  slug: "bronze" | "silver" | "gold" | "platinum";
  commission_rate: number;
  min_sales: number;
  min_revenue: number;
  benefits: string[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  requirement_type: "sales" | "revenue" | "referrals";
  requirement_value: number;
  reward_type: "bonus" | "tier_upgrade" | "badge";
  reward_value: string;
}

export interface Contest {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  prize_description: string;
  status: "draft" | "active" | "ended";
  metric: "clicks" | "conversions" | "revenue";
}

export interface DiscountCode {
  id: string;
  code: string;
  affiliate_id: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  status: "active" | "expired" | "disabled";
  created_at: string;
}

export interface Broadcast {
  id: string;
  title: string;
  content: string;
  sent_by: string;
  sent_at: string;
  recipient_count: number;
}

export interface Message {
  id: string;
  affiliate_id: string;
  sender_type: "affiliate" | "admin";
  subject: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  affiliate_id: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  created_at: string;
  updated_at: string;
}

export interface AffiliateStats {
  total_clicks: number;
  total_conversions: number;
  total_earnings: number;
  pending_earnings: number;
  conversion_rate: number;
  clicks_today: number;
  earnings_this_month: number;
}

export interface ChartDataPoint {
  date: string;
  clicks: number;
  conversions: number;
  revenue: number;
}
