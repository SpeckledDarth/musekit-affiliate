"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { Plus, Image, FileText, Share2, Mail, Pencil, Trash2, Upload, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { AffiliateAsset } from "@/types";

const typeIcons: Record<string, React.ReactNode> = {
  banner: <Image className="w-4 h-4" />,
  text: <FileText className="w-4 h-4" />,
  social: <Share2 className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
};

const typeBadgeVariant: Record<string, "default" | "primary" | "success" | "warning" | "danger" | "info"> = {
  banner: "primary",
  text: "default",
  social: "info",
  email: "warning",
};

const emptyForm = {
  title: "",
  description: "",
  asset_type: "banner",
  content: "",
  file_url: "",
};

export default function AdminAffiliateAssets() {
  const [assets, setAssets] = useState<AffiliateAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<AffiliateAsset | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AffiliateAsset | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.admin.getAssets();
        setAssets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load assets");
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

  function openEdit(item: AffiliateAsset) {
    setEditItem(item);
    setForm({
      title: item.title,
      description: item.description || "",
      asset_type: item.asset_type,
      content: item.content || "",
      file_url: item.file_url || "",
    });
    setShowModal(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.admin.uploadFile(file);
      setForm((f) => ({ ...f, file_url: result.url }));
      toast.success(`File "${result.file_name}" uploaded successfully`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "File upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    try {
      if (editItem) {
        const updated = await api.admin.updateAsset(editItem.id, {
          title: form.title,
          description: form.description || undefined,
          asset_type: form.asset_type,
          content: form.content || undefined,
          file_url: form.file_url || undefined,
        });
        setAssets((prev) => prev.map((a) => (a.id === editItem.id ? updated : a)));
        toast.success("Asset updated successfully");
      } else {
        const created = await api.admin.createAsset({
          title: form.title,
          description: form.description || undefined,
          asset_type: form.asset_type,
          content: form.content || undefined,
          file_url: form.file_url || undefined,
        });
        setAssets((prev) => [...prev, created]);
        toast.success("Asset created successfully");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save asset");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.admin.deleteAsset(deleteTarget.id);
      setAssets((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      toast.success("Asset deleted successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete asset");
    } finally {
      setDeleting(false);
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const columns = [
    {
      key: "title",
      header: "Asset",
      render: (item: AffiliateAsset) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
            {typeIcons[item.asset_type] || <FileText className="w-4 h-4" />}
          </div>
          <span className="font-medium">{item.title}</span>
        </div>
      ),
    },
    {
      key: "asset_type",
      header: "Type",
      render: (item: AffiliateAsset) => (
        <Badge variant={typeBadgeVariant[item.asset_type] || "default"}>
          {item.asset_type}
        </Badge>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (item: AffiliateAsset) => (
        <span className="text-gray-500 truncate max-w-[200px] block">
          {item.description || "—"}
        </span>
      ),
    },
    {
      key: "created_at",
      header: "Created",
      render: (item: AffiliateAsset) => formatDate(item.created_at),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (item: AffiliateAsset) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(item)}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  const filters = [
    {
      key: "asset_type",
      label: "Type",
      options: [
        { value: "banner", label: "Banner" },
        { value: "text", label: "Text" },
        { value: "social", label: "Social" },
        { value: "email", label: "Email" },
      ],
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketing Assets</h1>
          <p className="text-gray-500 mt-1">
            Upload and manage marketing materials for affiliates
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={assets}
        loading={loading}
        searchable
        searchPlaceholder="Search assets..."
        filters={filters}
        onRowClick={openEdit}
        emptyMessage="No assets available"
        headerActions={
          <Button onClick={openCreate}>
            <Plus className="w-4 h-4 mr-2" /> Add Asset
          </Button>
        }
      />

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editItem ? "Edit Asset" : "Add Asset"}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : editItem ? "Update Asset" : "Create Asset"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="Enter asset title"
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Brief description"
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asset Type
            </label>
            <select
              value={form.asset_type}
              onChange={(e) => setForm((f) => ({ ...f, asset_type: e.target.value }))}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="banner">Banner</option>
              <option value="text">Text</option>
              <option value="social">Social</option>
              <option value="email">Email</option>
            </select>
          </div>
          <Input
            label="Content"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            placeholder="Text content or embed code"
          />
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File Upload
            </label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File
                  </>
                )}
              </Button>
              {form.file_url && (
                <span className="text-sm text-green-600 truncate max-w-[200px]">
                  File uploaded
                </span>
              )}
            </div>
          </div>
          <Input
            label="Or enter File URL manually"
            value={form.file_url}
            onChange={(e) => setForm((f) => ({ ...f, file_url: e.target.value }))}
            placeholder="https://..."
          />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Asset"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  );
}
