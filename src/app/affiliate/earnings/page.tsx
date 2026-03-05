"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { SkeletonTable } from "@/components/ui/loading-skeleton";
import { DollarSign, TrendingUp, Clock } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatCents, formatDate } from "@/lib/format";
import type { AffiliateCommission, AffiliateStats } from "@/types";

export default function AffiliateEarnings() {
  const [commissions, setCommissions] = useState<AffiliateCommission[]>([]);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [c, s] = await Promise.all([
          api.affiliate.getCommissions(),
          api.affiliate.getStats(),
        ]);
        setCommissions(c);
        setStats(s);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const columns = [
    {
      key: "created_at",
      header: "Date",
      render: (item: AffiliateCommission) => formatDate(item.created_at),
    },
    {
      key: "invoice_amount_cents",
      header: "Sale Amount",
      render: (item: AffiliateCommission) =>
        formatCents(item.invoice_amount_cents),
    },
    {
      key: "commission_rate",
      header: "Rate",
      render: (item: AffiliateCommission) => `${item.commission_rate}%`,
    },
    {
      key: "commission_amount_cents",
      header: "Commission",
      render: (item: AffiliateCommission) => (
        <span className="font-semibold text-green-600">
          {formatCents(item.commission_amount_cents)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: AffiliateCommission) => (
        <Badge
          variant={
            item.status === "paid"
              ? "success"
              : item.status === "approved"
                ? "info"
                : item.status === "rejected"
                  ? "danger"
                  : "warning"
          }
        >
          {item.status}
        </Badge>
      ),
    },
  ];

  const statusFilter = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "paid", label: "Paid" },
        { value: "rejected", label: "Rejected" },
      ],
    },
  ];

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-500 mt-1">
            View your commission earnings history
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
        </div>
        <SkeletonTable columns={5} rows={5} />
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
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-500 mt-1">
          View your commission earnings history
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <StatCard
          label="Total Earnings"
          value={formatCents(stats?.total_earnings_cents ?? 0)}
          icon={DollarSign}
        />
        <StatCard
          label="Paid"
          value={formatCents(stats?.paid_earnings_cents ?? 0)}
          icon={TrendingUp}
        />
        <StatCard
          label="Pending"
          value={formatCents(stats?.pending_earnings_cents ?? 0)}
          icon={Clock}
        />
      </div>

      <DataTable
        columns={columns}
        data={commissions}
        emptyMessage="No commissions yet"
        searchable={true}
        searchPlaceholder="Search commissions..."
        filters={statusFilter}
      />
    </div>
  );
}
