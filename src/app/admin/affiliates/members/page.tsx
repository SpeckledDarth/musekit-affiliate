"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { formatCents, formatDate, formatPercent } from "@/lib/format";
import type { AffiliateListItem } from "@/types";

export default function AffiliateMembers() {
  const [members, setMembers] = useState<AffiliateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailMember, setDetailMember] = useState<AffiliateListItem | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.admin.getAffiliateList();
        setMembers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load members");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
      header: "Name",
      render: (item: AffiliateListItem) => (
        <div>
          <p className="font-medium">{item.profile?.full_name || item.ref_code}</p>
          <p className="text-xs text-gray-500">{item.profile?.email || "—"}</p>
        </div>
      ),
    },
    {
      key: "affiliate_role",
      header: "Role",
      render: (item: AffiliateListItem) => (
        <Badge variant="primary">{item.affiliate_role.toUpperCase()}</Badge>
      ),
    },
    {
      key: "suspended",
      header: "Status",
      render: (item: AffiliateListItem) => (
        <Badge variant={item.suspended ? "danger" : "success"}>
          {item.suspended ? "suspended" : "active"}
        </Badge>
      ),
    },
    {
      key: "signups",
      header: "Signups",
      render: (item: AffiliateListItem) => item.signups.toLocaleString(),
    },
    {
      key: "total_earnings_cents",
      header: "Total Earnings",
      render: (item: AffiliateListItem) => (
        <span className="font-semibold">
          {formatCents(item.total_earnings_cents)}
        </span>
      ),
    },
    {
      key: "locked_commission_rate",
      header: "Rate",
      render: (item: AffiliateListItem) =>
        item.locked_commission_rate != null ? `${item.locked_commission_rate}%` : "—",
    },
  ];

  const filters = [
    {
      key: "affiliate_role",
      label: "Role",
      options: [
        { value: "affiliate", label: "Affiliate" },
        { value: "ambassador", label: "Ambassador" },
        { value: "influencer", label: "Influencer" },
      ],
    },
    {
      key: "suspended",
      label: "Status",
      options: [
        { value: "false", label: "Active" },
        { value: "true", label: "Suspended" },
      ],
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Affiliate Members
        </h1>
        <p className="text-gray-500 mt-1">
          Active affiliates with performance stats
        </p>
      </div>
      <DataTable
        columns={columns}
        data={members}
        loading={loading}
        searchable
        searchPlaceholder="Search by name, email, or ref code..."
        filters={filters}
        onRowClick={(item: AffiliateListItem) => setDetailMember(item)}
        emptyMessage="No affiliate members found"
        exportable
        exportFilename="affiliate-members"
        urlPersist
      />

      <Modal
        open={!!detailMember}
        onClose={() => setDetailMember(null)}
        title="Member Details"
        size="md"
        footer={
          <Button variant="secondary" onClick={() => setDetailMember(null)}>
            Close
          </Button>
        }
      >
        {detailMember && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Full Name</p>
                <p className="text-sm text-gray-900 mt-1">{detailMember.profile?.full_name || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                <p className="text-sm text-gray-900 mt-1">{detailMember.profile?.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Ref Code</p>
                <p className="text-sm text-gray-900 mt-1 font-mono">{detailMember.ref_code}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Role</p>
                <p className="text-sm mt-1">
                  <Badge variant="primary">{detailMember.affiliate_role.toUpperCase()}</Badge>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                <p className="text-sm mt-1">
                  <Badge variant={detailMember.suspended ? "danger" : "success"}>
                    {detailMember.suspended ? "Suspended" : "Active"}
                  </Badge>
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Signups</p>
                <p className="text-sm text-gray-900 mt-1">{detailMember.signups.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Clicks</p>
                <p className="text-sm text-gray-900 mt-1">{detailMember.clicks.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Total Earnings</p>
                <p className="text-sm text-gray-900 mt-1 font-semibold">{formatCents(detailMember.total_earnings_cents)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Pending Earnings</p>
                <p className="text-sm text-gray-900 mt-1">{formatCents(detailMember.pending_earnings_cents)}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Commission Rate</p>
                <p className="text-sm text-gray-900 mt-1">{detailMember.locked_commission_rate != null ? `${detailMember.locked_commission_rate}%` : "—"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Joined</p>
                <p className="text-sm text-gray-900 mt-1">{formatDate(detailMember.created_at)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
