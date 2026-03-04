"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { mockDiscountCodes } from "@/lib/mock-data";

export default function AdminAffiliateDiscountCodes() {
  const columns = [
    {
      key: "code",
      header: "Code",
      render: (item: (typeof mockDiscountCodes)[0]) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono font-semibold">
          {item.code}
        </code>
      ),
    },
    {
      key: "discount_value",
      header: "Discount",
      render: (item: (typeof mockDiscountCodes)[0]) =>
        item.discount_type === "percentage"
          ? `${item.discount_value}%`
          : `$${item.discount_value}`,
    },
    {
      key: "current_uses",
      header: "Uses",
      render: (item: (typeof mockDiscountCodes)[0]) =>
        item.max_uses
          ? `${item.current_uses} / ${item.max_uses}`
          : `${item.current_uses} (unlimited)`,
    },
    {
      key: "status",
      header: "Status",
      render: (item: (typeof mockDiscountCodes)[0]) => (
        <Badge
          variant={
            item.status === "active"
              ? "success"
              : item.status === "expired"
                ? "warning"
                : "danger"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "expires_at",
      header: "Expires",
      render: (item: (typeof mockDiscountCodes)[0]) =>
        item.expires_at
          ? new Date(item.expires_at).toLocaleDateString()
          : "Never",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Discount Codes</h1>
          <p className="text-gray-500 mt-1">
            Create and manage discount codes for affiliates
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Create Code
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={mockDiscountCodes}
      />
    </div>
  );
}
