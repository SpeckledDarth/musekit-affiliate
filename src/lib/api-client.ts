const BASE = "";

async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

async function postApi<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

async function putApi<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

async function deleteApi<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

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
  TicketReply,
  AffiliateStats,
  AdminOverview,
  AffiliateListItem,
} from "@/types";

export const api = {
  affiliate: {
    getStats: () =>
      fetchApi<AffiliateStats>("/api/affiliate/stats"),
    getProfile: () =>
      fetchApi<AffiliateProfile | null>("/api/affiliate/profile"),
    updateProfile: (updates: Record<string, unknown>) =>
      postApi<AffiliateProfile>("/api/affiliate/profile", updates),
    getReferralLinks: () =>
      fetchApi<ReferralLink[]>("/api/affiliate/referral-links"),
    getReferrals: () =>
      fetchApi<AffiliateReferral[]>("/api/affiliate/referrals"),
    getCommissions: () =>
      fetchApi<AffiliateCommission[]>("/api/affiliate/commissions"),
    getPayouts: () =>
      fetchApi<AffiliatePayout[]>("/api/affiliate/payouts"),
    getResources: () =>
      fetchApi<AffiliateAsset[]>("/api/affiliate/resources"),
    getMessages: () =>
      fetchApi<AffiliateMessage[]>("/api/affiliate/messages"),
    sendMessage: (body: string) =>
      postApi<AffiliateMessage>("/api/affiliate/messages", { body }),
    markMessageRead: (id: string) =>
      postApi<{ success: boolean }>("/api/affiliate/messages", { action: "mark_read", id }),
    getBroadcasts: () =>
      fetchApi<AffiliateBroadcast[]>("/api/affiliate/broadcasts"),
    getAnnouncements: () =>
      fetchApi<Announcement[]>("/api/affiliate/announcements"),
    getSupportTickets: () =>
      fetchApi<SupportTicket[]>("/api/affiliate/support-tickets"),
    createSupportTicket: (ticket: { subject: string; description: string; priority?: string; category?: string }) =>
      postApi<SupportTicket>("/api/affiliate/support-tickets", ticket),
    updateTicketStatus: (id: string, status: string) =>
      postApi<SupportTicket>("/api/affiliate/support-tickets", { action: "update_status", id, status }),
    getTicketReplies: (ticketId: string) =>
      fetchApi<TicketReply[]>(`/api/affiliate/support-tickets?ticket_id=${ticketId}`),
    addTicketReply: (ticketId: string, body: string) =>
      postApi<TicketReply>("/api/affiliate/support-tickets", { action: "add_reply", ticket_id: ticketId, body }),
    getTiers: () =>
      fetchApi<AffiliateTier[]>("/api/affiliate/tiers"),
    getMilestones: () =>
      fetchApi<AffiliateMilestone[]>("/api/affiliate/milestones"),
  },
  admin: {
    getSettings: () =>
      fetchApi<Record<string, unknown>>("/api/admin/affiliates/settings"),
    updateSettings: (data: Record<string, unknown>) =>
      postApi<Record<string, unknown>>("/api/admin/affiliates/settings", data),
    getOverview: () =>
      fetchApi<AdminOverview>("/api/admin/affiliates/overview"),
    getAffiliateList: () =>
      fetchApi<AffiliateListItem[]>("/api/admin/affiliates/list"),
    getApplications: () =>
      fetchApi<AffiliateApplication[]>("/api/admin/affiliates/applications"),
    updateApplication: (id: string, status: string, notes?: string) =>
      postApi<AffiliateApplication>("/api/admin/affiliates/applications", { id, status, notes }),
    getBroadcasts: () =>
      fetchApi<AffiliateBroadcast[]>("/api/admin/affiliates/broadcasts"),
    createBroadcast: (data: { subject: string; body: string; category?: string }) =>
      postApi<AffiliateBroadcast>("/api/admin/affiliates/broadcasts", data),
    updateBroadcast: (id: string, updates: Record<string, unknown>) =>
      putApi<AffiliateBroadcast>("/api/admin/affiliates/broadcasts", { id, ...updates }),
    deleteBroadcast: (id: string) =>
      deleteApi<{ success: boolean }>(`/api/admin/affiliates/broadcasts?id=${id}`),
    getContests: () =>
      fetchApi<AffiliateContest[]>("/api/admin/affiliates/contests"),
    createContest: (data: { name: string; description?: string; metric: string; start_date: string; end_date: string; prize_description?: string; prize_amount_cents?: number }) =>
      postApi<AffiliateContest>("/api/admin/affiliates/contests", data),
    updateContest: (id: string, updates: Record<string, unknown>) =>
      putApi<AffiliateContest>("/api/admin/affiliates/contests", { id, ...updates }),
    deleteContest: (id: string) =>
      deleteApi<{ success: boolean }>(`/api/admin/affiliates/contests?id=${id}`),
    getDiscountCodes: () =>
      fetchApi<DiscountCode[]>("/api/admin/affiliates/discount-codes"),
    createDiscountCode: (data: { code: string; discount_type: string; discount_value: number; description?: string; max_uses?: number; expires_at?: string; affiliate_user_id?: string }) =>
      postApi<DiscountCode>("/api/admin/affiliates/discount-codes", data),
    updateDiscountCode: (id: string, updates: Record<string, unknown>) =>
      putApi<DiscountCode>("/api/admin/affiliates/discount-codes", { id, ...updates }),
    deleteDiscountCode: (id: string) =>
      deleteApi<{ success: boolean }>(`/api/admin/affiliates/discount-codes?id=${id}`),
    getPayoutBatches: () =>
      fetchApi<AffiliatePayoutBatch[]>("/api/admin/affiliates/payout-batches"),
    createPayoutBatch: (data: { batch_date: string; total_affiliates: number; total_amount_cents: number; notes?: string }) =>
      postApi<AffiliatePayoutBatch>("/api/admin/affiliates/payout-batches", data),
    getAssets: () =>
      fetchApi<AffiliateAsset[]>("/api/admin/affiliates/assets"),
    createAsset: (data: { title: string; description?: string; asset_type: string; content?: string; file_url?: string; file_name?: string }) =>
      postApi<AffiliateAsset>("/api/admin/affiliates/assets", data),
    updateAsset: (id: string, updates: Record<string, unknown>) =>
      putApi<AffiliateAsset>("/api/admin/affiliates/assets", { id, ...updates }),
    deleteAsset: (id: string) =>
      deleteApi<{ success: boolean }>(`/api/admin/affiliates/assets?id=${id}`),
    uploadFile: async (file: File): Promise<{ url: string; file_name: string; file_size: number; file_type: string }> => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${BASE}/api/admin/affiliates/upload`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      return res.json();
    },
    getTiers: () =>
      fetchApi<AffiliateTier[]>("/api/admin/affiliates/tiers"),
    createTier: (data: { name: string; min_referrals: number; commission_rate: number; min_payout_cents?: number; perks?: string[]; sort_order?: number }) =>
      postApi<AffiliateTier>("/api/admin/affiliates/tiers", data),
    updateTier: (id: string, updates: Record<string, unknown>) =>
      putApi<AffiliateTier>("/api/admin/affiliates/tiers", { id, ...updates }),
    deleteTier: (id: string) =>
      deleteApi<{ success: boolean }>(`/api/admin/affiliates/tiers?id=${id}`),
    getMilestones: () =>
      fetchApi<AffiliateMilestone[]>("/api/admin/affiliates/milestones"),
    createMilestone: (data: { name: string; referral_threshold: number; bonus_amount_cents: number; description?: string; is_active?: boolean; sort_order?: number }) =>
      postApi<AffiliateMilestone>("/api/admin/affiliates/milestones", data),
    updateMilestone: (id: string, updates: Record<string, unknown>) =>
      putApi<AffiliateMilestone>("/api/admin/affiliates/milestones", { id, ...updates }),
    deleteMilestone: (id: string) =>
      deleteApi<{ success: boolean }>(`/api/admin/affiliates/milestones?id=${id}`),
  },
};
