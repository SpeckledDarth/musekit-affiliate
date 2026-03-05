"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { DollarSign, TrendingUp, Clock } from "lucide-react";
import { api } from "@/lib/api-client";
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
      render: (item: AffiliateCommission) =>
        new Date(item.created_at).toLocaleDateString(),
    },
    {
      key: "invoice_amount_cents",
      header: "Sale Amount",
      render: (item: AffiliateCommission) =>
        `$${(item.invoice_amount_cents / 100).toFixed(2)}`,
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
          ${(item.commission_amount_cents / 100).toFixed(2)}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Loading earnings...</div>
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
          value={`$${((stats?.total_earnings_cents ?? 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
        />
        <StatCard
          label="Paid"
          value={`$${((stats?.paid_earnings_cents ?? 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingUp}
        />
        <StatCard
          label="Pending"
          value={`$${((stats?.pending_earnings_cents ?? 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={Clock}
        />
      </div>

      <DataTable
        columns={columns}
        data={commissions}
        emptyMessage="No commissions yet"
      />
    </div>
  );
}
