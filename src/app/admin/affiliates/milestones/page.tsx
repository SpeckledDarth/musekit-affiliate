"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, Trophy, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatCents } from "@/lib/format";
import { toast } from "sonner";
import type { AffiliateMilestone } from "@/types";

export default function AdminAffiliateMilestones() {
  const [milestones, setMilestones] = useState<AffiliateMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<AffiliateMilestone | null>(null);
  const [form, setForm] = useState({
    name: "",
    referral_threshold: "",
    bonus_amount: "",
    description: "",
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AffiliateMilestone | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.admin.getMilestones();
        setMilestones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load milestones");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function openCreate() {
    setEditItem(null);
    setForm({ name: "", referral_threshold: "", bonus_amount: "", description: "", is_active: true });
    setShowModal(true);
  }

  function openEdit(item: AffiliateMilestone) {
    setEditItem(item);
    setForm({
      name: item.name,
      referral_threshold: String(item.referral_threshold),
      bonus_amount: (item.bonus_amount_cents / 100).toFixed(2),
      description: item.description || "",
      is_active: item.is_active,
    });
    setShowModal(true);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        referral_threshold: Number(form.referral_threshold),
        bonus_amount_cents: Math.round(Number(form.bonus_amount) * 100),
        description: form.description || undefined,
        is_active: form.is_active,
      };
      if (editItem) {
        const updated = await api.admin.updateMilestone(editItem.id, payload);
        setMilestones(prev => prev.map(i => i.id === editItem.id ? updated : i));
        toast.success("Milestone updated successfully");
      } else {
        const created = await api.admin.createMilestone(payload);
        setMilestones(prev => [...prev, created]);
        toast.success("Milestone created successfully");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save milestone");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.admin.deleteMilestone(deleteTarget.id);
      setMilestones(prev => prev.filter(i => i.id !== deleteTarget.id));
      toast.success("Milestone deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete milestone");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-7 w-40 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-36 bg-muted rounded-lg animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                    <div className="flex gap-2 mt-3">
                      <div className="h-5 w-24 bg-muted rounded-full animate-pulse" />
                      <div className="h-5 w-20 bg-muted rounded-full animate-pulse" />
                    </div>
                  </div>
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Milestones</h1>
          <p className="text-muted-foreground mt-1">
            Define achievements and rewards for affiliates
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Add Milestone
        </Button>
      </div>

      {milestones.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No milestones defined yet
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {milestones.map((milestone) => (
            <Card key={milestone.id}>
              <CardContent className="py-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">
                        {milestone.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(milestone)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(milestone)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {milestone.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge>
                        {milestone.referral_threshold} referrals
                      </Badge>
                      <Badge variant="success">
                        {formatCents(milestone.bonus_amount_cents)} bonus
                      </Badge>
                      {!milestone.is_active && (
                        <Badge variant="warning">Inactive</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? "Edit Milestone" : "Add Milestone"}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editItem ? "Update Milestone" : "Create Milestone"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Bronze Achievement"
          />
          <Input
            label="Referral Threshold"
            type="number"
            value={form.referral_threshold}
            onChange={(e) => setForm(prev => ({ ...prev, referral_threshold: e.target.value }))}
            placeholder="e.g., 10"
          />
          <Input
            label="Bonus Amount ($)"
            type="number"
            step="0.01"
            value={form.bonus_amount}
            onChange={(e) => setForm(prev => ({ ...prev, bonus_amount: e.target.value }))}
            placeholder="e.g., 50.00"
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe this milestone"
          />
          <label className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
              className="rounded border-border text-primary-600 focus:ring-ring"
            />
            Active
          </label>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Milestone"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
