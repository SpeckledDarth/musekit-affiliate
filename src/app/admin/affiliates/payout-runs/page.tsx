"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { mockPayoutRuns } from "@/lib/mock-data";

export default function AdminAffiliatePayoutRuns() {
  const columns = [
    {
      key: "created_at",
      header: "Date",
      render: (item: (typeof mockPayoutRuns)[0]) =>
        new Date(item.created_at).toLocaleDateString(),
    },
    {
      key: "total_amount",
      header: "Total Amount",
      render: (item: (typeof mockPayoutRuns)[0]) => (
        <span className="font-semibold">
          ${item.total_amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: "affiliate_count",
      header: "Affiliates",
      render: (item: (typeof mockPayoutRuns)[0]) => item.affiliate_count,
    },
    {
      key: "status",
      header: "Status",
      render: (item: (typeof mockPayoutRuns)[0]) => (
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
      key: "completed_at",
      header: "Completed",
      render: (item: (typeof mockPayoutRuns)[0]) =>
        item.completed_at
          ? new Date(item.completed_at).toLocaleDateString()
          : "-",
    },
  ];

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
        data={mockPayoutRuns}
      />
    </div>
  );
}
