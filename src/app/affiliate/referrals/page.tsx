"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { mockReferrals } from "@/lib/mock-data";

export default function AffiliateReferrals() {
  const columns = [
    { key: "id", header: "ID" },
    {
      key: "landing_page",
      header: "Landing Page",
      render: (item: (typeof mockReferrals)[0]) => (
        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
          {item.landing_page}
        </code>
      ),
    },
    {
      key: "clicked_at",
      header: "Clicked",
      render: (item: (typeof mockReferrals)[0]) =>
        new Date(item.clicked_at).toLocaleDateString(),
    },
    {
      key: "converted",
      header: "Status",
      render: (item: (typeof mockReferrals)[0]) => (
        <Badge variant={item.converted ? "success" : "default"}>
          {item.converted ? "Converted" : "Clicked"}
        </Badge>
      ),
    },
    {
      key: "converted_at",
      header: "Converted At",
      render: (item: (typeof mockReferrals)[0]) =>
        item.converted_at
          ? new Date(item.converted_at).toLocaleDateString()
          : "-",
    },
  ];

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
        data={mockReferrals}
      />
    </div>
  );
}
