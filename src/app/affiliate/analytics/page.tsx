"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api-client";
import type { AffiliateStats, AffiliateReferral, ChartDataPoint } from "@/types";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

function buildChartData(referrals: AffiliateReferral[]): ChartDataPoint[] {
  const dayMap: Record<string, { clicks: number; conversions: number; revenue: number }> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dayMap[key] = { clicks: 0, conversions: 0, revenue: 0 };
  }
  for (const r of referrals) {
    const day = r.created_at.split("T")[0];
    if (dayMap[day]) {
      dayMap[day].clicks += 1;
      if (r.status === "converted") {
        dayMap[day].conversions += 1;
      }
    }
  }
  return Object.entries(dayMap).map(([date, v]) => ({ date, ...v }));
}

export default function AffiliateAnalytics() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [s, referrals] = await Promise.all([
          api.affiliate.getStats(),
          api.affiliate.getReferrals(),
        ]);
        setStats(s);
        setChartData(buildChartData(referrals));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Loading analytics...</div>
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

  const totalClicks = stats?.total_clicks ?? 0;
  const totalReferrals = stats?.total_referrals ?? 0;
  const totalEarningsCents = stats?.total_earnings_cents ?? 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">
          Track your clicks, conversions, and revenue over time
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-sm text-gray-500">Avg. Daily Clicks</p>
          <p className="text-2xl font-bold">
            {totalClicks > 0 ? Math.round(totalClicks / 30) : 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Avg. Daily Referrals</p>
          <p className="text-2xl font-bold">
            {totalReferrals > 0 ? Math.round(totalReferrals / 30) : 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Avg. Daily Revenue</p>
          <p className="text-2xl font-bold">
            ${totalEarningsCents > 0 ? Math.round(totalEarningsCents / 100 / 30) : 0}
          </p>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Clicks Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) =>
                      new Date(v).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    labelFormatter={(v) =>
                      new Date(v).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="#4c6ef5"
                    fill="#dbe4ff"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversions & Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) =>
                      new Date(v).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    }
                    fontSize={12}
                  />
                  <YAxis yAxisId="left" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" fontSize={12} />
                  <Tooltip
                    labelFormatter={(v) =>
                      new Date(v).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })
                    }
                  />
                  <Bar
                    yAxisId="left"
                    dataKey="conversions"
                    fill="#4c6ef5"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="revenue"
                    fill="#e64980"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
