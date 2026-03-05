"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Check, X, FileText } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import type { AffiliateApplication } from "@/types";

const statusBadgeVariant: Record<string, "warning" | "success" | "danger"> = {
  pending: "warning",
  approved: "success",
  rejected: "danger",
};

export default function AffiliateApplications() {
  const [applications, setApplications] = useState<AffiliateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.admin.getApplications();
        setApplications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load applications");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleAction(id: string, status: "approved" | "rejected") {
    setActionLoading(id);
    try {
      await api.admin.updateApplication(id, status);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app)),
      );
      toast.success(`Application ${status} successfully`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(null);
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
      key: "name",
      header: "Name / Email",
      render: (app: AffiliateApplication) => (
        <div>
          <div className="font-medium text-gray-900">{app.name}</div>
          <div className="text-sm text-gray-500">{app.email}</div>
        </div>
      ),
    },
    {
      key: "website_url",
      header: "Website",
      render: (app: AffiliateApplication) =>
        app.website_url ? (
          <span className="text-sm text-gray-600">{app.website_url}</span>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        ),
    },
    {
      key: "status",
      header: "Status",
      render: (app: AffiliateApplication) => (
        <Badge variant={statusBadgeVariant[app.status] || "default"}>
          {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: "created_at",
      header: "Applied Date",
      render: (app: AffiliateApplication) => (
        <span className="text-sm text-gray-600">{formatDate(app.created_at)}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      sortable: false,
      render: (app: AffiliateApplication) =>
        app.status === "pending" ? (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant="secondary"
              disabled={actionLoading === app.id}
              onClick={() => handleAction(app.id, "rejected")}
            >
              <X className="w-4 h-4 mr-1" /> Reject
            </Button>
            <Button
              size="sm"
              disabled={actionLoading === app.id}
              onClick={() => handleAction(app.id, "approved")}
            >
              <Check className="w-4 h-4 mr-1" /> Approve
            </Button>
          </div>
        ) : (
          <span className="text-sm text-gray-400">Reviewed</span>
        ),
    },
  ];

  const filters = [
    {
      key: "status",
      label: "Status",
      options: [
        { value: "pending", label: "Pending" },
        { value: "approved", label: "Approved" },
        { value: "rejected", label: "Rejected" },
      ],
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Affiliate Applications
        </h1>
        <p className="text-gray-500 mt-1">
          Review and manage affiliate applications
        </p>
      </div>

      <DataTable
        columns={columns}
        data={applications}
        loading={loading}
        searchable
        searchPlaceholder="Search by name, email, or website..."
        filters={filters}
        emptyMessage="No applications found"
        emptyIcon={<FileText className="w-8 h-8 text-gray-400" />}
        title="Applications"
      />
    </div>
  );
}
