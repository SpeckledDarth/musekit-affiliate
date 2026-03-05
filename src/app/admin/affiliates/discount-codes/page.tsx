"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { DiscountCode } from "@/types";

const emptyForm = {
  code: "",
  discount_type: "percentage" as "percentage" | "fixed",
  discount_value: "",
  description: "",
  max_uses: "",
  expires_at: "",
  affiliate_user_id: "",
};

export default function AdminAffiliateDiscountCodes() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<DiscountCode | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  function openCreate() {
    setForm({ ...emptyForm });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.code.trim()) {
      toast.error("Code is required");
      return;
    }
    if (!form.discount_value || Number(form.discount_value) <= 0) {
      toast.error("Discount value must be greater than 0");
      return;
    }
    setSaving(true);
    try {
      const payload: Parameters<typeof api.admin.createDiscountCode>[0] = {
        code: form.code.trim().toUpperCase(),
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
      };
      if (form.description.trim()) payload.description = form.description.trim();
      if (form.max_uses && Number(form.max_uses) > 0) payload.max_uses = Number(form.max_uses);
      if (form.expires_at) payload.expires_at = form.expires_at;
      if (form.affiliate_user_id.trim()) payload.affiliate_user_id = form.affiliate_user_id.trim();

      const created = await api.admin.createDiscountCode(payload);
      setCodes((prev) => [...prev, created]);
      toast.success("Discount code created");
      setShowModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create discount code");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.admin.deleteDiscountCode(deleteTarget.id);
      setCodes((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success("Discount code deleted");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete discount code");
    } finally {
      setDeleting(false);
    }
  }

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
      key: "discount_type",
      header: "Type",
      render: (item: DiscountCode) => (
        <Badge variant={item.discount_type === "percentage" ? "info" : "primary"}>
          {item.discount_type}
        </Badge>
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
        item.expires_at ? formatDate(item.expires_at) : "Never",
    },
    {
      key: "actions",
      header: "",
      sortable: false,
      render: (item: DiscountCode) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setDeleteTarget(item);
          }}
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      ),
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "expired", label: "Expired" },
        { value: "disabled", label: "Disabled" },
      ],
    },
    {
      key: "discount_type",
      label: "Type",
      options: [
        { value: "percentage", label: "Percentage" },
        { value: "fixed", label: "Fixed" },
      ],
    },
  ];

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
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Create Code
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={codes}
        loading={loading}
        searchable
        searchPlaceholder="Search codes..."
        filters={filters}
        emptyMessage="No discount codes yet."
      />

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Create Discount Code"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Creating..." : "Create Code"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Code"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            placeholder="e.g. SUMMER20"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
            <select
              value={form.discount_type}
              onChange={(e) => setForm((f) => ({ ...f, discount_type: e.target.value as "percentage" | "fixed" }))}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount ($)</option>
            </select>
          </div>
          <Input
            label={form.discount_type === "percentage" ? "Discount (%)" : "Discount ($)"}
            type="number"
            min="0"
            step={form.discount_type === "percentage" ? "1" : "0.01"}
            value={form.discount_value}
            onChange={(e) => setForm((f) => ({ ...f, discount_value: e.target.value }))}
            placeholder={form.discount_type === "percentage" ? "e.g. 20" : "e.g. 10.00"}
          />
          <Input
            label="Description (optional)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Brief description of this code"
          />
          <Input
            label="Max Uses (optional)"
            type="number"
            min="0"
            value={form.max_uses}
            onChange={(e) => setForm((f) => ({ ...f, max_uses: e.target.value }))}
            placeholder="Leave empty for unlimited"
          />
          <Input
            label="Expires At (optional)"
            type="date"
            value={form.expires_at}
            onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
          />
          <Input
            label="Affiliate User ID (optional)"
            value={form.affiliate_user_id}
            onChange={(e) => setForm((f) => ({ ...f, affiliate_user_id: e.target.value }))}
            placeholder="Assign to a specific affiliate"
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Discount Code"
        message={`Are you sure you want to delete the discount code "${deleteTarget?.code}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
