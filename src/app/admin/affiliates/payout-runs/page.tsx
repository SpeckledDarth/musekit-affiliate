"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatCents, formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { AffiliatePayoutBatch } from "@/types";

export default function AdminAffiliatePayoutRuns() {
  const [batches, setBatches] = useState<AffiliatePayoutBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    batch_date: "",
    total_affiliates: "",
    total_amount: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.admin.getPayoutBatches()
      .then(setBatches)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setForm({ batch_date: "", total_affiliates: "", total_amount: "", notes: "" });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.batch_date || !form.total_affiliates || !form.total_amount) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);
    try {
      const created = await api.admin.createPayoutBatch({
        batch_date: form.batch_date,
        total_affiliates: parseInt(form.total_affiliates, 10),
        total_amount_cents: Math.round(parseFloat(form.total_amount) * 100),
        notes: form.notes || undefined,
      });
      setBatches((prev) => [...prev, created]);
      toast.success("Payout run created successfully");
      setShowModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create payout run");
    } finally {
      setSaving(false);
    }
  }

  const columns = [
    {
      key: "batch_date",
      header: "Date",
      render: (item: AffiliatePayoutBatch) => formatDate(item.batch_date),
    },
    {
      key: "total_amount_cents",
      header: "Total Amount",
      render: (item: AffiliatePayoutBatch) => (
        <span className="font-semibold">{formatCents(item.total_amount_cents)}</span>
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
      render: (item: AffiliatePayoutBatch) => formatDate(item.approved_at),
    },
    {
      key: "notes",
      header: "Notes",
      render: (item: AffiliatePayoutBatch) => (
        <span className="text-gray-500 truncate max-w-[200px] block">
          {item.notes || "—"}
        </span>
      ),
    },
  ];

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
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Payout Run
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={batches}
        loading={loading}
        emptyMessage="No payout runs yet."
        searchable
        searchPlaceholder="Search payout runs..."
        exportable
        exportFilename="payout-runs"
        filters={[
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
        ]}
      />

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="New Payout Run"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Creating..." : "Create Payout Run"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Batch Date"
            type="date"
            value={form.batch_date}
            onChange={(e) => setForm((f) => ({ ...f, batch_date: e.target.value }))}
          />
          <Input
            label="Total Affiliates"
            type="number"
            min="1"
            placeholder="Number of affiliates"
            value={form.total_affiliates}
            onChange={(e) => setForm((f) => ({ ...f, total_affiliates: e.target.value }))}
          />
          <Input
            label="Total Amount ($)"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.total_amount}
            onChange={(e) => setForm((f) => ({ ...f, total_amount: e.target.value }))}
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Optional notes about this payout run"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
