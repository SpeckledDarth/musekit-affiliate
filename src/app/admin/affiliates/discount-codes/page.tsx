"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import type { DiscountCode } from "@/types";

export default function AdminAffiliateDiscountCodes() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCodes = () => {
    setLoading(true);
    api.admin.getDiscountCodes()
      .then(setCodes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCodes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discount code?")) return;
    try {
      await api.admin.deleteDiscountCode(id);
      setCodes((prev) => prev.filter((c) => c.id !== id));
    } catch (err: unknown) {
      alert("Failed to delete discount code: " + (err instanceof Error ? err.message : "Unknown error"));
    }
  };

  const columns = [
    {
      key: "code",
      header: "Code",
      render: (item: DiscountCode) => (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono font-semibold">
          {item.code}
        </code>
      ),
    },
    {
      key: "discount_value",
      header: "Discount",
      render: (item: DiscountCode) =>
        item.discount_type === "percentage"
          ? `${item.discount_value}%`
          : `$${item.discount_value}`,
    },
    {
      key: "total_uses",
      header: "Uses",
      render: (item: DiscountCode) =>
        item.max_uses
          ? `${item.total_uses} / ${item.max_uses}`
          : `${item.total_uses} (unlimited)`,
    },
    {
      key: "status",
      header: "Status",
      render: (item: DiscountCode) => (
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
      render: (item: DiscountCode) =>
        item.expires_at
          ? new Date(item.expires_at).toLocaleDateString()
          : "Never",
    },
    {
      key: "actions",
      header: "",
      render: (item: DiscountCode) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDelete(item.id)}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      ),
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
        Failed to load discount codes: {error}
      </div>
    );
  }

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
        data={codes}
        emptyMessage="No discount codes yet."
      />
    </div>
  );
}
