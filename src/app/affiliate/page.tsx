"use client";

import { useState, useEffect } from "react";
import {
  MousePointerClick,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api-client";
import { formatCents, formatDate } from "@/lib/format";
import { Skeleton, SkeletonCard } from "@/components/ui/loading-skeleton";
import type { AffiliateStats, ReferralLink, AffiliateCommission } from "@/types";

export default function AffiliateDashboard() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [link, setLink] = useState<ReferralLink | null>(null);
  const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, links, c] = await Promise.all([
          api.affiliate.getStats(),
          api.affiliate.getReferralLinks(),
          api.affiliate.getCommissions(),
        ]);
        setStats(s);
        setLink(links[0] || null);
        setCommissions(c.slice(0, 5));
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
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{link ? `, ${link.ref_code}` : ""}
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s an overview of your affiliate performance
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Clicks"
          value={(stats?.total_clicks ?? 0).toLocaleString()}
          change={`${stats?.total_signups ?? 0} signups`}
          changeType="positive"
          icon={MousePointerClick}
        />
        <StatCard
          label="Referrals"
          value={stats?.total_referrals ?? 0}
          change={`${stats?.conversion_rate ?? 0}% conversion`}
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          label="Total Earnings"
          value={formatCents(stats?.total_earnings_cents ?? 0)}
          change={`${formatCents(stats?.paid_earnings_cents ?? 0)} paid`}
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          label="Pending Earnings"
          value={formatCents(stats?.pending_earnings_cents ?? 0)}
          changeType="neutral"
          icon={Clock}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Affiliate Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Referral Code</span>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                  {link?.ref_code ?? "—"}
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Role</span>
                <Badge variant="primary">
                  {(link?.affiliate_role ?? "affiliate").toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Commission Rate</span>
                <span className="font-semibold">
                  {link?.locked_commission_rate != null ? `${link.locked_commission_rate}%` : "Default"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <Badge variant={link?.suspended ? "danger" : "success"}>
                  {link?.suspended ? "Suspended" : "Active"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Member Since</span>
                <span className="text-sm">
                  {formatDate(link?.created_at)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Commissions</CardTitle>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commissions.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No commissions yet</p>
              ) : (
                commissions.map((comm) => (
                  <div
                    key={comm.id}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatCents(comm.invoice_amount_cents)} sale
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comm.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600 flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" />
                        {formatCents(comm.commission_amount_cents)}
                      </p>
                      <Badge
                        variant={
                          comm.status === "paid"
                            ? "success"
                            : comm.status === "approved"
                              ? "info"
                              : comm.status === "rejected"
                                ? "danger"
                                : "warning"
                        }
                      >
                        {comm.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
