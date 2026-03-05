"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/lib/api-client";
import type { AffiliateReferral } from "@/types";

export default function AffiliateReferrals() {
  const [referrals, setReferrals] = useState<AffiliateReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.affiliate.getReferrals();
        setReferrals(data);
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
      key: "ref_code",
      header: "Ref Code",
      render: (item: AffiliateReferral) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
          {item.ref_code}
        </code>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      render: (item: AffiliateReferral) =>
        new Date(item.created_at).toLocaleDateString(),
    },
    {
      key: "status",
      header: "Status",
      render: (item: AffiliateReferral) => (
        <Badge
          variant={
            item.status === "converted"
              ? "success"
              : item.status === "churned"
                ? "danger"
                : item.status === "fraud"
                  ? "danger"
                  : "warning"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "converted_at",
      header: "Converted At",
      render: (item: AffiliateReferral) =>
        item.converted_at
          ? new Date(item.converted_at).toLocaleDateString()
          : "—",
    },
    {
      key: "source_tag",
      header: "Source",
      render: (item: AffiliateReferral) => item.source_tag || "—",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Loading referrals...</div>
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
        <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
        <p className="text-gray-500 mt-1">
          Track all your referred visitors and their conversion status
        </p>
      </div>
      <DataTable
        columns={columns}
        data={referrals}
        emptyMessage="No referrals yet"
      />
    </div>
  );
}
