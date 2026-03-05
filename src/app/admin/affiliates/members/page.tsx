"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/lib/api-client";
import type { AffiliateListItem } from "@/types";

export default function AffiliateMembers() {
  const [members, setMembers] = useState<AffiliateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.admin.getAffiliateList();
        setMembers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load members");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading members...</div>
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

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (item: AffiliateListItem) => (
        <div>
          <p className="font-medium">{item.profile?.full_name || item.ref_code}</p>
          <p className="text-xs text-gray-500">{item.profile?.email || "—"}</p>
        </div>
      ),
    },
    {
      key: "affiliate_role",
      header: "Role",
      render: (item: AffiliateListItem) => (
        <Badge variant="primary">{item.affiliate_role.toUpperCase()}</Badge>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: AffiliateListItem) => (
        <Badge variant={item.suspended ? "danger" : "success"}>
          {item.suspended ? "suspended" : "active"}
        </Badge>
      ),
    },
    {
      key: "signups",
      header: "Signups",
      render: (item: AffiliateListItem) => item.signups.toLocaleString(),
    },
    {
      key: "total_earnings_cents",
      header: "Total Earnings",
      render: (item: AffiliateListItem) => (
        <span className="font-semibold">
          ${(item.total_earnings_cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "locked_commission_rate",
      header: "Rate",
      render: (item: AffiliateListItem) =>
        item.locked_commission_rate ? `${item.locked_commission_rate}%` : "—",
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
      <DataTable columns={columns} data={members} />
    </div>
  );
}
