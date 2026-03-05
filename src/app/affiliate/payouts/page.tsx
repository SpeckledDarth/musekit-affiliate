"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { SkeletonTable } from "@/components/ui/loading-skeleton";
import { api } from "@/lib/api-client";
import { formatCents, formatDate } from "@/lib/format";
import type { AffiliatePayout } from "@/types";

const statusVariant = (status: string) => {
  switch (status) {
    case "completed": return "success" as const;
    case "processing": return "info" as const;
    case "failed": return "danger" as const;
    default: return "warning" as const;
  }
};

const filters = [
  {
    key: "status",
    label: "Status",
    options: [
      { value: "pending", label: "Pending" },
      { value: "processing", label: "Processing" },
      { value: "completed", label: "Completed" },
      { value: "failed", label: "Failed" },
    ],
  },
  {
    key: "method",
    label: "Method",
    options: [
      { value: "paypal", label: "PayPal" },
      { value: "stripe", label: "Stripe" },
      { value: "bank_transfer", label: "Bank Transfer" },
    ],
  },
];

export default function AffiliatePayouts() {
  const [payouts, setPayouts] = useState<AffiliatePayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AffiliatePayout | null>(null);

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
      render: (item: AffiliatePayout) => formatDate(item.created_at),
    },
    {
      key: "amount_cents",
      header: "Amount",
      render: (item: AffiliatePayout) => (
        <span className="font-semibold">{formatCents(item.amount_cents)}</span>
      ),
    },
    {
      key: "method",
      header: "Method",
      render: (item: AffiliatePayout) => (
        <span className="capitalize">{item.method?.replace("_", " ")}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: AffiliatePayout) => (
        <Badge variant={statusVariant(item.status)}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "processed_at",
      header: "Processed",
      render: (item: AffiliatePayout) => formatDate(item.processed_at),
    },
  ];

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
          <p className="text-gray-500 mt-1">
            View your pending and completed payouts
          </p>
        </div>
        <SkeletonTable rows={5} columns={5} />
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
        searchable={true}
        searchPlaceholder="Search payouts..."
        filters={filters}
        onRowClick={(item: AffiliatePayout) => setSelected(item)}
        exportable
        exportFilename="my-payouts"
        urlPersist
      />

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Payout Details"
        size="md"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Amount</p>
                <p className="text-lg font-semibold text-gray-900">{formatCents(selected.amount_cents)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Method</p>
                <p className="text-sm text-gray-900 capitalize">{selected.method?.replace("_", " ")}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                <div className="mt-1">
                  <Badge variant={statusVariant(selected.status)}>
                    {selected.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Created</p>
                <p className="text-sm text-gray-900">{formatDate(selected.created_at)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Processed</p>
                <p className="text-sm text-gray-900">{formatDate(selected.processed_at)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Batch ID</p>
                <p className="text-sm text-gray-900 font-mono">{selected.batch_id || "—"}</p>
              </div>
            </div>
            {selected.notes && (
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Notes</p>
                <p className="text-sm text-gray-900 mt-1">{selected.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
