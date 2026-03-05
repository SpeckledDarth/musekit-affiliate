"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trophy } from "lucide-react";
import { api } from "@/lib/api-client";
import type { AffiliateMilestone } from "@/types";

export default function AdminAffiliateMilestones() {
  const [milestones, setMilestones] = useState<AffiliateMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.admin.getMilestones();
        setMilestones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load milestones");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading milestones...</div>
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Milestones</h1>
          <p className="text-gray-500 mt-1">
            Define achievements and rewards for affiliates
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Milestone
        </Button>
      </div>

      {milestones.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No milestones defined yet
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {milestones.map((milestone) => (
            <Card key={milestone.id}>
              <CardContent className="py-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {milestone.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {milestone.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge>
                        {milestone.referral_threshold} referrals
                      </Badge>
                      <Badge variant="success">
                        ${(milestone.bonus_amount_cents / 100).toFixed(2)} bonus
                      </Badge>
                      {!milestone.is_active && (
                        <Badge variant="warning">Inactive</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
