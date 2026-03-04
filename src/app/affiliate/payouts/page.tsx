"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { mockPayouts } from "@/lib/mock-data";

export default function AffiliatePayouts() {
  const columns = [
    {
      key: "created_at",
      header: "Date",
      render: (item: (typeof mockPayouts)[0]) =>
        new Date(item.created_at).toLocaleDateString(),
    },
    {
      key: "amount",
      header: "Amount",
      render: (item: (typeof mockPayouts)[0]) => (
        <span className="font-semibold">${item.amount.toFixed(2)}</span>
      ),
    },
    {
      key: "payment_method",
      header: "Method",
      render: (item: (typeof mockPayouts)[0]) => (
        <span className="capitalize">{item.payment_method}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (item: (typeof mockPayouts)[0]) => (
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
      key: "transaction_id",
      header: "Transaction ID",
      render: (item: (typeof mockPayouts)[0]) =>
        item.transaction_id ? (
          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
            {item.transaction_id}
          </code>
        ) : (
          "-"
        ),
    },
  ];

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
        data={mockPayouts}
      />
    </div>
  );
}
