"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { api } from "@/lib/api-client";
import type { AffiliatePayoutBatch } from "@/types";

export default function AdminAffiliatePayoutRuns() {
  const [batches, setBatches] = useState<AffiliatePayoutBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.admin.getPayoutBatches()
      .then(setBatches)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    {
      key: "batch_date",
      header: "Date",
      render: (item: AffiliatePayoutBatch) =>
        new Date(item.batch_date).toLocaleDateString(),
    },
    {
      key: "total_amount_cents",
      header: "Total Amount",
      render: (item: AffiliatePayoutBatch) => (
        <span className="font-semibold">
          ${(item.total_amount_cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      key: "total_affiliates",
      header: "Affiliates",
      render: (item: AffiliatePayoutBatch) => item.total_affiliates,
    },
    {
      key: "status",
      header: "Status",
      render: (item: AffiliatePayoutBatch) => (
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
      key: "approved_at",
      header: "Approved",
      render: (item: AffiliatePayoutBatch) =>
        item.approved_at
          ? new Date(item.approved_at).toLocaleDateString()
          : "-",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load payout runs: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payout Runs</h1>
          <p className="text-gray-500 mt-1">
            Batch payment processing for affiliates
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New Payout Run
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={batches}
        emptyMessage="No payout runs yet."
      />
    </div>
  );
}
