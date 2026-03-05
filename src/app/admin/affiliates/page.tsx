"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp, UserPlus } from "lucide-react";
import { api } from "@/lib/api-client";
import type { AdminOverview, AffiliateListItem } from "@/types";

export default function AdminAffiliatesOverview() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [topPerformers, setTopPerformers] = useState<AffiliateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [ov, list] = await Promise.all([
          api.admin.getOverview(),
          api.admin.getAffiliateList(),
        ]);
        setOverview(ov);
        setTopPerformers(list.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading overview...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Affiliate Program Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and monitor your affiliate program
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Affiliates"
          value={overview?.total_affiliates ?? 0}
          icon={Users}
        />
        <StatCard
          label="Active Affiliates"
          value={overview?.active_affiliates ?? 0}
          change={`${overview?.pending_applications ?? 0} pending`}
          changeType="neutral"
          icon={UserPlus}
        />
        <StatCard
          label="Total Commissions"
          value={`$${((overview?.total_commissions_cents ?? 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          icon={DollarSign}
        />
        <StatCard
          label="Total Referrals"
          value={overview?.total_referrals ?? 0}
          change={`${(overview?.total_clicks ?? 0).toLocaleString()} clicks`}
          changeType="neutral"
          icon={TrendingUp}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No affiliates yet</p>
            ) : (
              topPerformers.map((affiliate, i) => (
                <div
                  key={affiliate.user_id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {affiliate.profile?.full_name || affiliate.profile?.email || affiliate.ref_code}
                      </p>
                      <p className="text-xs text-gray-500">
                        {affiliate.profile?.email || affiliate.ref_code}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="primary">
                      {affiliate.affiliate_role.toUpperCase()}
                    </Badge>
                    <span className="font-semibold text-gray-900">
                      ${(affiliate.total_earnings_cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
