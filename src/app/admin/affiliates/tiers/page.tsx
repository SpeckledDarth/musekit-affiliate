"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Crown, Check, Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatCents } from "@/lib/format";
import { toast } from "sonner";
import type { AffiliateTier } from "@/types";

const tierColors: Record<string, string> = {
  bronze: "bg-orange-100 text-orange-700",
  silver: "bg-muted text-muted-foreground",
  gold: "bg-yellow-100 text-yellow-700",
  platinum: "bg-purple-100 text-purple-700",
};

interface TierForm {
  name: string;
  min_referrals: string;
  commission_rate: string;
  min_payout: string;
  perks: string;
  sort_order: string;
}

const emptyForm: TierForm = {
  name: "",
  min_referrals: "0",
  commission_rate: "10",
  min_payout: "",
  perks: "",
  sort_order: "0",
};

export default function AdminAffiliateTiers() {
  const [tiers, setTiers] = useState<AffiliateTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<AffiliateTier | null>(null);
  const [form, setForm] = useState<TierForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AffiliateTier | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.admin.getTiers();
        setTiers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tiers");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function openCreate() {
    setEditItem(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(tier: AffiliateTier) {
    setEditItem(tier);
    setForm({
      name: tier.name,
      min_referrals: String(tier.min_referrals),
      commission_rate: String(tier.commission_rate),
      min_payout: tier.min_payout_cents != null ? String(tier.min_payout_cents / 100) : "",
      perks: tier.perks ? tier.perks.join(", ") : "",
      sort_order: String(tier.sort_order),
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Tier name is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        min_referrals: parseInt(form.min_referrals) || 0,
        commission_rate: parseFloat(form.commission_rate) || 0,
        min_payout_cents: form.min_payout ? Math.round(parseFloat(form.min_payout) * 100) : undefined,
        perks: form.perks.trim() ? form.perks.split(",").map((p) => p.trim()).filter(Boolean) : [],
        sort_order: parseInt(form.sort_order) || 0,
      };
      if (editItem) {
        const updated = await api.admin.updateTier(editItem.id, payload);
        setTiers((prev) => prev.map((t) => (t.id === editItem.id ? updated : t)));
        toast.success("Tier updated successfully");
      } else {
        const created = await api.admin.createTier(payload);
        setTiers((prev) => [...prev, created]);
        toast.success("Tier created successfully");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save tier");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.admin.deleteTier(deleteTarget.id);
      setTiers((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      toast.success("Tier deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete tier");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-72 bg-muted rounded animate-pulse mt-2" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-1 bg-muted" />
              <CardHeader>
                <div className="h-6 w-24 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-10 w-20 mx-auto bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Affiliate Tiers</h1>
          <p className="text-muted-foreground mt-1">
            Commission tiers and their requirements
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tier
        </Button>
      </div>

      {tiers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No tiers configured yet
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const tierKey = tier.name.toLowerCase();
            const colorClass = tierColors[tierKey] || "bg-muted text-muted-foreground";
            return (
              <Card key={tier.id} className="relative overflow-hidden">
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${colorClass.split(" ")[0]}`}
                />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Crown
                        className={`w-5 h-5 ${colorClass.split(" ")[1]}`}
                      />
                      <CardTitle>{tier.name}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(tier)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(tier)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <span className="text-3xl font-bold text-foreground">
                      {tier.commission_rate}%
                    </span>
                    <p className="text-sm text-muted-foreground">commission</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Min Referrals:</span>{" "}
                      {tier.min_referrals}
                    </div>
                    {tier.min_payout_cents != null && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Min Payout:</span>{" "}
                        {formatCents(tier.min_payout_cents)}
                      </div>
                    )}
                  </div>
                  {tier.perks && tier.perks.length > 0 && (
                    <ul className="space-y-2">
                      {tier.perks.map((perk) => (
                        <li
                          key={perk}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? "Edit Tier" : "Add Tier"}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editItem ? "Update Tier" : "Create Tier"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Tier Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Gold"
          />
          <Input
            label="Min Referrals"
            type="number"
            value={form.min_referrals}
            onChange={(e) => setForm((f) => ({ ...f, min_referrals: e.target.value }))}
            placeholder="0"
          />
          <Input
            label="Commission Rate (%)"
            type="number"
            step="0.1"
            value={form.commission_rate}
            onChange={(e) => setForm((f) => ({ ...f, commission_rate: e.target.value }))}
            placeholder="10"
          />
          <Input
            label="Min Payout ($)"
            type="number"
            step="0.01"
            value={form.min_payout}
            onChange={(e) => setForm((f) => ({ ...f, min_payout: e.target.value }))}
            placeholder="50.00"
          />
          <Input
            label="Perks (comma-separated)"
            value={form.perks}
            onChange={(e) => setForm((f) => ({ ...f, perks: e.target.value }))}
            placeholder="Priority support, Custom links, Early access"
          />
          <Input
            label="Sort Order"
            type="number"
            value={form.sort_order}
            onChange={(e) => setForm((f) => ({ ...f, sort_order: e.target.value }))}
            placeholder="0"
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Tier"
        message={`Are you sure you want to delete the "${deleteTarget?.name}" tier? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
