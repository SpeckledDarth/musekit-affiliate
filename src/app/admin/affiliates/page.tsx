"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp, UserPlus } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatCents } from "@/lib/format";
import type { AdminOverview, AffiliateListItem } from "@/types";

function SkeletonStatCard() {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-4 bg-muted rounded w-24" />
        <div className="h-5 w-5 bg-muted rounded" />
      </div>
      <div className="h-8 bg-muted rounded w-20 mt-2" />
      <div className="h-3 bg-muted rounded w-16 mt-2" />
    </div>
  );
}

function SkeletonList() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 bg-muted rounded w-32 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-2 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-muted rounded-full" />
                <div>
                  <div className="h-4 bg-muted rounded w-32 mb-1" />
                  <div className="h-3 bg-muted rounded w-40" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-5 bg-muted rounded-full w-16" />
                <div className="h-5 bg-muted rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

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
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Affiliate Program Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your affiliate program
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
        <SkeletonList />
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
        <h1 className="text-2xl font-bold text-foreground">
          Affiliate Program Overview
        </h1>
        <p className="text-muted-foreground mt-1">
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
          value={formatCents(overview?.total_commissions_cents ?? 0)}
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
              <p className="text-muted-foreground text-center py-4">No affiliates yet</p>
            ) : (
              topPerformers.map((affiliate, i) => (
                <div
                  key={affiliate.user_id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">
                        {affiliate.profile?.full_name || affiliate.profile?.email || affiliate.ref_code}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {affiliate.profile?.email || affiliate.ref_code}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="primary">
                      {affiliate.affiliate_role.toUpperCase()}
                    </Badge>
                    <span className="font-semibold text-foreground">
                      {formatCents(affiliate.total_earnings_cents)}
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
