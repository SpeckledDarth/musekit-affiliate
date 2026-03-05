"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { SkeletonTable } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api-client";
import { formatDate, relativeTime } from "@/lib/format";
import type { AffiliateReferral } from "@/types";

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "converted":
      return "success";
    case "churned":
    case "fraud":
      return "danger";
    default:
      return "warning";
  }
};

export default function AffiliateReferrals() {
  const [referrals, setReferrals] = useState<AffiliateReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReferral, setSelectedReferral] = useState<AffiliateReferral | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.affiliate.getReferrals();
        setReferrals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const columns = [
    {
      key: "ref_code",
      header: "Ref Code",
      render: (item: AffiliateReferral) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
          {item.ref_code}
        </code>
      ),
    },
    {
      key: "created_at",
      header: "Date",
      render: (item: AffiliateReferral) => formatDate(item.created_at),
    },
    {
      key: "status",
      header: "Status",
      render: (item: AffiliateReferral) => (
        <Badge variant={statusBadgeVariant(item.status)}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: "converted_at",
      header: "Converted At",
      render: (item: AffiliateReferral) => formatDate(item.converted_at),
    },
    {
      key: "source_tag",
      header: "Source",
      render: (item: AffiliateReferral) => item.source_tag || "—",
    },
  ];

  const statusFilterOptions = [
    { value: "pending", label: "Pending" },
    { value: "converted", label: "Converted" },
    { value: "churned", label: "Churned" },
    { value: "fraud", label: "Fraud" },
  ];

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
          <p className="text-gray-500 mt-1">
            Track all your referred visitors and their conversion status
          </p>
        </div>
        <SkeletonTable rows={5} columns={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (referrals.length === 0) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
          <p className="text-gray-500 mt-1">
            Track all your referred visitors and their conversion status
          </p>
        </div>
        <EmptyState
          title="No referrals yet"
          description="Share your referral link to start tracking visitors and conversions."
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
        <p className="text-gray-500 mt-1">
          Track all your referred visitors and their conversion status
        </p>
      </div>
      <DataTable
        columns={columns}
        data={referrals}
        searchable={true}
        searchPlaceholder="Search referrals..."
        filters={[
          {
            key: "status",
            label: "Status",
            options: statusFilterOptions,
          },
        ]}
        onRowClick={(item: AffiliateReferral) => setSelectedReferral(item)}
        emptyMessage="No referrals match your filters"
      />

      <Modal
        open={!!selectedReferral}
        onClose={() => setSelectedReferral(null)}
        title="Referral Details"
        size="md"
      >
        {selectedReferral && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Ref Code</p>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                  {selectedReferral.ref_code}
                </code>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Status</p>
                <div className="mt-1">
                  <Badge variant={statusBadgeVariant(selectedReferral.status)}>
                    {selectedReferral.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Source Tag</p>
                <p className="text-sm text-gray-900 mt-1">
                  {selectedReferral.source_tag || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Created</p>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(selectedReferral.created_at)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Converted</p>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(selectedReferral.converted_at)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Health Status</p>
                <p className="text-sm text-gray-900 mt-1">
                  {selectedReferral.health_status || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Fraud Flags</p>
                <p className="text-sm text-gray-900 mt-1">
                  {selectedReferral.fraud_flags && selectedReferral.fraud_flags.length > 0
                    ? selectedReferral.fraud_flags.join(", ")
                    : "None"}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Last Active</p>
                <p className="text-sm text-gray-900 mt-1">
                  {relativeTime(selectedReferral.last_active_at)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs font-medium text-gray-500 uppercase">Churn Reason</p>
                <p className="text-sm text-gray-900 mt-1">
                  {selectedReferral.churn_reason || "—"}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
