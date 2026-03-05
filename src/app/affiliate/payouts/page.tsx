"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/lib/api-client";
import type { AffiliatePayout } from "@/types";

export default function AffiliatePayouts() {
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.affiliate.getPayouts();
        setPayouts(data);
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
      render: (item: AffiliatePayout) =>
        new Date(item.created_at).toLocaleDateString(),
    },
    {
      key: "amount_cents",
      header: "Amount",
      render: (item: AffiliatePayout) => (
        <span className="font-semibold">${(item.amount_cents / 100).toFixed(2)}</span>
      ),
    },
    {
      key: "method",
      header: "Method",
      render: (item: AffiliatePayout) => (
        <span className="capitalize">{item.method}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: AffiliatePayout) => (
        <Badge
          variant={
            item.status === "completed"
              ? "success"
              : item.status === "processing"
                ? "info"
                : item.status === "failed"
                  ? "danger"
                  : "warning"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "processed_at",
      header: "Processed",
      render: (item: AffiliatePayout) =>
        item.processed_at
          ? new Date(item.processed_at).toLocaleDateString()
          : "—",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Loading payouts...</div>
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
        <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
        <p className="text-gray-500 mt-1">
          View your pending and completed payouts
        </p>
      </div>
      <DataTable
        columns={columns}
        data={payouts}
        emptyMessage="No payouts yet"
      />
    </div>
  );
}
