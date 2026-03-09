"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/ui/search-input";
import { Plus, Megaphone, Users, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { AffiliateBroadcast } from "@/types";

export default function AdminAffiliateBroadcasts() {
  const [broadcasts, setBroadcasts] = useState<AffiliateBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject: "", body: "", category: "" });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AffiliateBroadcast | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.admin.getBroadcasts()
      .then(setBroadcasts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function openCreate() {
    setForm({ subject: "", body: "", category: "" });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.subject.trim() || !form.body.trim()) {
      toast.error("Subject and body are required");
      return;
    }
    setSaving(true);
    try {
      const data: { subject: string; body: string; category?: string } = {
        subject: form.subject,
        body: form.body,
      };
      if (form.category) {
        data.category = form.category;
      }
      const created = await api.admin.createBroadcast(data);
      setBroadcasts((prev) => [created, ...prev]);
      toast.success("Broadcast created successfully");
      setShowModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create broadcast");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.admin.deleteBroadcast(deleteTarget.id);
      setBroadcasts((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      toast.success("Broadcast deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete broadcast");
    } finally {
      setDeleting(false);
    }
  }

  const filteredBroadcasts = broadcasts.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.subject.toLowerCase().includes(q) ||
      b.body.toLowerCase().includes(q) ||
      (b.category && b.category.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse mt-2" />
          </div>
          <div className="h-10 w-40 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-muted rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-1/3 bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                    <div className="h-3 w-1/4 bg-muted rounded" />
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
      <div className="text-center py-12 text-red-600">
        Failed to load broadcasts: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Broadcasts</h1>
          <p className="text-muted-foreground mt-1">
            Send announcements to all affiliates
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> New Broadcast
        </Button>
      </div>

      <div className="mb-4 w-64">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search broadcasts..."
        />
      </div>

      <div className="space-y-4">
        {filteredBroadcasts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              {search ? "No broadcasts match your search." : "No broadcasts yet."}
            </CardContent>
          </Card>
        ) : (
          filteredBroadcasts.map((broadcast) => (
            <Card key={broadcast.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {broadcast.subject}
                      </h3>
                      {broadcast.category && (
                        <Badge variant="info">{broadcast.category}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {broadcast.body}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span>
                        {formatDate(broadcast.sent_at || broadcast.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {broadcast.sent_count} recipients
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(broadcast)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="New Broadcast"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Sending..." : "Send Broadcast"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Subject"
            value={form.subject}
            onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            placeholder="Enter broadcast subject"
          />
          <Textarea
            label="Body"
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            placeholder="Write your broadcast message..."
          />
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Category (optional)
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary-500"
            >
              <option value="">None</option>
              <option value="announcement">Announcement</option>
              <option value="promotion">Promotion</option>
              <option value="update">Update</option>
              <option value="newsletter">Newsletter</option>
            </select>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Broadcast"
        message={`Are you sure you want to delete the broadcast "${deleteTarget?.subject}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
