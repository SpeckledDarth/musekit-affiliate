"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { mockAffiliates } from "@/lib/mock-data";

export default function AffiliateMembers() {
  const columns = [
    {
      key: "name",
      header: "Name",
      render: (item: (typeof mockAffiliates)[0]) => (
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      ),
    },
    {
      key: "tier",
      header: "Tier",
      render: (item: (typeof mockAffiliates)[0]) => (
        <Badge variant="primary">{item.tier.toUpperCase()}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: (typeof mockAffiliates)[0]) => (
        <Badge
          variant={
            item.status === "active"
              ? "success"
              : item.status === "pending"
                ? "warning"
                : "danger"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "total_conversions",
      header: "Conversions",
      render: (item: (typeof mockAffiliates)[0]) =>
        item.total_conversions.toLocaleString(),
    },
    {
      key: "total_earnings",
      header: "Total Earnings",
      render: (item: (typeof mockAffiliates)[0]) => (
        <span className="font-semibold">
          ${item.total_earnings.toLocaleString()}
        </span>
      ),
    },
    {
      key: "commission_rate",
      header: "Rate",
      render: (item: (typeof mockAffiliates)[0]) =>
        `${item.commission_rate}%`,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Affiliate Members
        </h1>
        <p className="text-gray-500 mt-1">
          Active affiliates with performance stats
        </p>
      </div>
      <DataTable
        columns={columns}
        data={mockAffiliates}
      />
    </div>
  );
}
