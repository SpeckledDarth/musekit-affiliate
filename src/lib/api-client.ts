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
    getBroadcasts: () =>
      fetchApi<AffiliateBroadcast[]>("/api/affiliate/broadcasts"),
    getAnnouncements: () =>
      fetchApi<Announcement[]>("/api/affiliate/announcements"),
    getSupportTickets: () =>
      fetchApi<SupportTicket[]>("/api/affiliate/support-tickets"),
    createSupportTicket: (ticket: { subject: string; description: string; priority?: string }) =>
      postApi<SupportTicket>("/api/affiliate/support-tickets", ticket),
    getTiers: () =>
      fetchApi<AffiliateTier[]>("/api/affiliate/tiers"),
    getMilestones: () =>
      fetchApi<AffiliateMilestone[]>("/api/affiliate/milestones"),
  },
  admin: {
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
    createBroadcast: (data: { subject: string; body: string }) =>
      postApi<AffiliateBroadcast>("/api/admin/affiliates/broadcasts", data),
    getContests: () =>
      fetchApi<AffiliateContest[]>("/api/admin/affiliates/contests"),
    getDiscountCodes: () =>
      fetchApi<DiscountCode[]>("/api/admin/affiliates/discount-codes"),
    deleteDiscountCode: (id: string) =>
      deleteApi<{ success: boolean }>(`/api/admin/affiliates/discount-codes?id=${id}`),
    getPayoutBatches: () =>
      fetchApi<AffiliatePayoutBatch[]>("/api/admin/affiliates/payout-batches"),
    getAssets: () =>
      fetchApi<AffiliateAsset[]>("/api/admin/affiliates/assets"),
    deleteAsset: (id: string) =>
      deleteApi<{ success: boolean }>(`/api/admin/affiliates/assets?id=${id}`),
    getTiers: () =>
      fetchApi<AffiliateTier[]>("/api/admin/affiliates/tiers"),
    getMilestones: () =>
      fetchApi<AffiliateMilestone[]>("/api/admin/affiliates/milestones"),
  },
};
