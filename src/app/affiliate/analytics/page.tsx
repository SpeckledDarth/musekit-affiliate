"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { mockChartData, mockStats } from "@/lib/mock-data";
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

export default function AffiliateAnalytics() {
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
            {Math.round(mockStats.total_clicks / 30)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Avg. Daily Conversions</p>
          <p className="text-2xl font-bold">
            {Math.round(mockStats.total_conversions / 30)}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-500">Avg. Daily Revenue</p>
          <p className="text-2xl font-bold">
            ${Math.round(mockStats.total_earnings / 30)}
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
                <AreaChart data={mockChartData}>
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
                <BarChart data={mockChartData}>
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
