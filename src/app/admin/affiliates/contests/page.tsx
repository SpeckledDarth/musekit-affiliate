"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Plus, PartyPopper, Calendar, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatDate, formatCents } from "@/lib/format";
import { toast } from "sonner";
import type { AffiliateContest } from "@/types";

const METRIC_OPTIONS = ["signups", "clicks", "revenue", "referrals"];

const defaultForm = {
  name: "",
  description: "",
  metric: "signups",
  start_date: "",
  end_date: "",
  prize_description: "",
  prize_amount: "",
};

export default function AdminAffiliateContests() {
  const [contests, setContests] = useState<AffiliateContest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<AffiliateContest | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AffiliateContest | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.admin.getContests()
      .then(setContests)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setEditItem(null);
    setForm(defaultForm);
    setShowModal(true);
  }

  function openEdit(contest: AffiliateContest) {
    setEditItem(contest);
    setForm({
      name: contest.name,
      description: contest.description || "",
      metric: contest.metric,
      start_date: contest.start_date ? contest.start_date.slice(0, 10) : "",
      end_date: contest.end_date ? contest.end_date.slice(0, 10) : "",
      prize_description: contest.prize_description || "",
      prize_amount: contest.prize_amount_cents ? (contest.prize_amount_cents / 100).toString() : "",
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.start_date || !form.end_date) {
      toast.error("Start and end dates are required");
      return;
    }
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        description: form.description || undefined,
        metric: form.metric,
        start_date: form.start_date,
        end_date: form.end_date,
        prize_description: form.prize_description || undefined,
        prize_amount_cents: form.prize_amount ? Math.round(parseFloat(form.prize_amount) * 100) : undefined,
      };
      if (editItem) {
        const updated = await api.admin.updateContest(editItem.id, payload);
        setContests((prev) => prev.map((c) => (c.id === editItem.id ? updated : c)));
        toast.success("Contest updated successfully");
      } else {
        const created = await api.admin.createContest(payload as Parameters<typeof api.admin.createContest>[0]);
        setContests((prev) => [...prev, created]);
        toast.success("Contest created successfully");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save contest");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.admin.deleteContest(deleteTarget.id);
      setContests((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      toast.success("Contest deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete contest");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-7 w-40 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-36 bg-muted rounded animate-pulse" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="py-5">
              <div className="flex items-start gap-4 animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-48 bg-muted rounded" />
                  <div className="h-4 w-full bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load contests: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contests</h1>
          <p className="text-muted-foreground mt-1">
            Manage promotional campaigns and contests
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Create Contest
        </Button>
      </div>

      <div className="space-y-4">
        {contests.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No contests yet.
            </CardContent>
          </Card>
        ) : (
          contests.map((contest) => (
            <Card key={contest.id}>
              <CardContent className="py-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PartyPopper className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {contest.name}
                      </h3>
                      <Badge
                        variant={
                          contest.status === "active"
                            ? "success"
                            : contest.status === "draft"
                              ? "default"
                              : "warning"
                        }
                      >
                        {contest.status}
                      </Badge>
                    </div>
                    {contest.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {contest.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(contest.start_date)} – {formatDate(contest.end_date)}
                      </span>
                      <Badge variant="info">Metric: {contest.metric}</Badge>
                    </div>
                    {(contest.prize_description || contest.prize_amount_cents) && (
                      <p className="text-sm text-muted-foreground mt-2">
                        <span className="font-medium">Prize:</span>{" "}
                        {contest.prize_description}
                        {contest.prize_amount_cents != null && contest.prize_amount_cents > 0 && (
                          <span className="ml-1 font-semibold text-green-700">
                            ({formatCents(contest.prize_amount_cents)})
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(contest)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(contest)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? "Edit Contest" : "Create Contest"}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editItem ? "Update Contest" : "Create Contest"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Contest name"
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Contest description"
              rows={3}
              className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary-500"
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-foreground mb-1">
              Metric
            </label>
            <select
              value={form.metric}
              onChange={(e) => setForm((f) => ({ ...f, metric: e.target.value }))}
              className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary-500"
            >
              {METRIC_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={form.start_date}
              onChange={(e) => setForm((f) => ({ ...f, start_date: e.target.value }))}
            />
            <Input
              label="End Date"
              type="date"
              value={form.end_date}
              onChange={(e) => setForm((f) => ({ ...f, end_date: e.target.value }))}
            />
          </div>
          <Input
            label="Prize Description"
            value={form.prize_description}
            onChange={(e) => setForm((f) => ({ ...f, prize_description: e.target.value }))}
            placeholder="e.g., Custom trophy + bonus commission"
          />
          <Input
            label="Prize Amount ($)"
            type="number"
            min="0"
            step="0.01"
            value={form.prize_amount}
            onChange={(e) => setForm((f) => ({ ...f, prize_amount: e.target.value }))}
            placeholder="0.00"
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Contest"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
