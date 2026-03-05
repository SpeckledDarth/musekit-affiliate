"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Check } from "lucide-react";
import { api } from "@/lib/api-client";
import type { AffiliateTier } from "@/types";

const tierColors: Record<string, string> = {
  bronze: "bg-orange-100 text-orange-700",
  silver: "bg-gray-200 text-gray-700",
  gold: "bg-yellow-100 text-yellow-700",
  platinum: "bg-purple-100 text-purple-700",
};

export default function AdminAffiliateTiers() {
  const [tiers, setTiers] = useState<AffiliateTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.admin.getTiers();
        setTiers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load tiers");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading tiers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Tiers</h1>
        <p className="text-gray-500 mt-1">
          Commission tiers and their requirements
        </p>
      </div>

      {tiers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No tiers configured yet
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => {
            const tierKey = tier.name.toLowerCase();
            const colorClass = tierColors[tierKey] || "bg-gray-100 text-gray-700";
            return (
              <Card key={tier.id} className="relative overflow-hidden">
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${colorClass.split(" ")[0]}`}
                />
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Crown
                      className={`w-5 h-5 ${colorClass.split(" ")[1]}`}
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
                      <span className="font-medium">Min Referrals:</span>{" "}
                      {tier.min_referrals}
                    </div>
                    {tier.min_payout_cents !== null && (
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Min Payout:</span> $
                        {(tier.min_payout_cents / 100).toLocaleString()}
                      </div>
                    )}
                  </div>
                  {tier.perks && tier.perks.length > 0 && (
                    <ul className="space-y-2">
                      {tier.perks.map((perk) => (
                        <li
                          key={perk}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {perk}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
