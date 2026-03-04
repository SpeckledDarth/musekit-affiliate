"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { StatCard } from "@/components/ui/stat-card";
import { DollarSign, TrendingUp, Clock } from "lucide-react";
import { mockConversions, mockStats } from "@/lib/mock-data";

export default function AffiliateEarnings() {
  const columns = [
    {
      key: "created_at",
      header: "Date",
      render: (item: (typeof mockConversions)[0]) =>
        new Date(item.created_at).toLocaleDateString(),
    },
    {
      key: "sale_amount",
      header: "Sale Amount",
      render: (item: (typeof mockConversions)[0]) =>
        `$${item.sale_amount.toFixed(2)}`,
    },
    {
      key: "commission_amount",
      header: "Commission",
      render: (item: (typeof mockConversions)[0]) => (
        <span className="font-semibold text-green-600">
          ${item.commission_amount.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: (typeof mockConversions)[0]) => (
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
          value={`$${mockStats.total_earnings.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          label="This Month"
          value={`$${mockStats.earnings_this_month}`}
          change="+12% vs last month"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          label="Pending"
          value={`$${mockStats.pending_earnings}`}
          icon={Clock}
        />
      </div>

      <DataTable
        columns={columns}
        data={mockConversions}
      />
    </div>
  );
}
