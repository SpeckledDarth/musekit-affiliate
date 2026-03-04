"use client";

import {
  MousePointerClick,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowUpRight,
  Users,
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockStats, mockAffiliate, mockConversions } from "@/lib/mock-data";

export default function AffiliateDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {mockAffiliate.name}
        </h1>
        <p className="text-gray-500 mt-1">
          Here&apos;s an overview of your affiliate performance
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Clicks"
          value={mockStats.total_clicks.toLocaleString()}
          change="+47 today"
          changeType="positive"
          icon={MousePointerClick}
        />
        <StatCard
          label="Conversions"
          value={mockStats.total_conversions}
          change={`${mockStats.conversion_rate}% rate`}
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          label="Total Earnings"
          value={`$${mockStats.total_earnings.toLocaleString()}`}
          change={`$${mockStats.earnings_this_month} this month`}
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          label="Pending Earnings"
          value={`$${mockStats.pending_earnings.toLocaleString()}`}
          change="Next payout Dec 1"
          changeType="neutral"
          icon={Clock}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Affiliate Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Referral Code</span>
                <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                  {mockAffiliate.referral_code}
                </code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Tier</span>
                <Badge variant="primary">
                  {mockAffiliate.tier.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Commission Rate</span>
                <span className="font-semibold">
                  {mockAffiliate.commission_rate}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Status</span>
                <Badge variant="success">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Member Since</span>
                <span className="text-sm">
                  {new Date(mockAffiliate.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Conversions</CardTitle>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockConversions.map((conv) => (
                <div
                  key={conv.id}
                  className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      ${conv.sale_amount.toFixed(2)} sale
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(conv.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600 flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" />$
                      {conv.commission_amount.toFixed(2)}
                    </p>
                    <Badge
                      variant={
                        conv.status === "paid"
                          ? "success"
                          : conv.status === "approved"
                            ? "info"
                            : "warning"
                      }
                    >
                      {conv.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
