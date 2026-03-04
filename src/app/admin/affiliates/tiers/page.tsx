"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Check } from "lucide-react";
import { mockTiers } from "@/lib/mock-data";

const tierColors: Record<string, string> = {
  bronze: "bg-orange-100 text-orange-700",
  silver: "bg-gray-200 text-gray-700",
  gold: "bg-yellow-100 text-yellow-700",
  platinum: "bg-purple-100 text-purple-700",
};

export default function AdminAffiliateTiers() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Tiers</h1>
        <p className="text-gray-500 mt-1">
          Commission tiers and their requirements
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockTiers.map((tier) => (
          <Card key={tier.id} className="relative overflow-hidden">
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${tierColors[tier.slug]?.replace("text-", "bg-").replace("bg-", "bg-")}`}
            />
            <CardHeader>
              <div className="flex items-center gap-2">
                <Crown
                  className={`w-5 h-5 ${tierColors[tier.slug]?.split(" ")[1]}`}
                />
                <CardTitle>{tier.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {tier.commission_rate}%
                </span>
                <p className="text-sm text-gray-500">commission</p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Min Sales:</span>{" "}
                  {tier.min_sales}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Min Revenue:</span> $
                  {tier.min_revenue.toLocaleString()}
                </div>
              </div>
              <ul className="space-y-2">
                {tier.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
