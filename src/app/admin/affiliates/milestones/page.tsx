"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trophy } from "lucide-react";
import { mockMilestones } from "@/lib/mock-data";

export default function AdminAffiliateMilestones() {
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

      <div className="grid md:grid-cols-2 gap-6">
        {mockMilestones.map((milestone) => (
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
                      {milestone.requirement_value}{" "}
                      {milestone.requirement_type}
                    </Badge>
                    <Badge variant="success">{milestone.reward_value}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
