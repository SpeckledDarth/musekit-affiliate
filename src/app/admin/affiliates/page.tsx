"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, TrendingUp, UserPlus } from "lucide-react";
import { mockAffiliates } from "@/lib/mock-data";

export default function AdminAffiliatesOverview() {
  const totalEarnings = mockAffiliates.reduce(
    (sum, a) => sum + a.total_earnings,
    0,
  );
  const activeCount = mockAffiliates.filter(
    (a) => a.status === "active",
  ).length;
  const pendingCount = mockAffiliates.filter(
    (a) => a.status === "pending",
  ).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Affiliate Program Overview
        </h1>
        <p className="text-gray-500 mt-1">
          Manage and monitor your affiliate program
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Affiliates"
          value={mockAffiliates.length}
          icon={Users}
        />
        <StatCard
          label="Active Affiliates"
          value={activeCount}
          change={`${pendingCount} pending`}
          changeType="neutral"
          icon={UserPlus}
        />
        <StatCard
          label="Total Commissions Paid"
          value={`$${totalEarnings.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          label="Avg Conversion Rate"
          value="12.4%"
          change="+2.1% vs last month"
          changeType="positive"
          icon={TrendingUp}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAffiliates
              .filter((a) => a.status === "active")
              .sort((a, b) => b.total_earnings - a.total_earnings)
              .slice(0, 5)
              .map((affiliate, i) => (
                <div
                  key={affiliate.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold text-gray-500">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {affiliate.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {affiliate.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="primary">
                      {affiliate.tier.toUpperCase()}
                    </Badge>
                    <span className="font-semibold text-gray-900">
                      ${affiliate.total_earnings.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
