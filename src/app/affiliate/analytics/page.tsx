"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import { formatCents } from "@/lib/format";
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

type RangeOption = { label: string; days: number | null };

const rangeOptions: RangeOption[] = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "All Time", days: null },
];

function buildChartData(referrals: AffiliateReferral[], dayCount: number | null): ChartDataPoint[] {
  const dayMap: Record<string, { clicks: number; conversions: number; revenue: number }> = {};

  if (dayCount !== null) {
    for (let i = dayCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      dayMap[key] = { clicks: 0, conversions: 0, revenue: 0 };
    }
  } else {
    for (const r of referrals) {
      const day = r.created_at.split("T")[0];
      if (!dayMap[day]) {
        dayMap[day] = { clicks: 0, conversions: 0, revenue: 0 };
      }
    }
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

  return Object.entries(dayMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, v]) => ({ date, ...v }));
}

export default function AffiliateAnalytics() {
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [referrals, setReferrals] = useState<AffiliateReferral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<RangeOption>(rangeOptions[1]);

  useEffect(() => {
    async function load() {
      try {
        const [s, refs] = await Promise.all([
          api.affiliate.getStats(),
          api.affiliate.getReferrals(),
        ]);
        setStats(s);
        setReferrals(refs);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const chartData = useMemo(
    () => buildChartData(referrals, selectedRange.days),
    [referrals, selectedRange]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading analytics...</div>
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

  const divisor = selectedRange.days ?? Math.max(chartData.length, 1);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your clicks, conversions, and revenue over time
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        {rangeOptions.map((opt) => (
          <Button
            key={opt.label}
            variant={selectedRange.label === opt.label ? "primary" : "ghost"}
            size="sm"
            onClick={() => setSelectedRange(opt)}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Avg. Daily Clicks</p>
          <p className="text-2xl font-bold">
            {totalClicks > 0 ? Math.round(totalClicks / divisor) : 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Avg. Daily Referrals</p>
          <p className="text-2xl font-bold">
            {totalReferrals > 0 ? Math.round(totalReferrals / divisor) : 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Avg. Daily Revenue</p>
          <p className="text-2xl font-bold">
            {formatCents(totalEarningsCents > 0 ? Math.round(totalEarningsCents / divisor) : 0)}
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
