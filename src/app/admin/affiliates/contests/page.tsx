"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, PartyPopper, Calendar } from "lucide-react";
import { mockContests } from "@/lib/mock-data";

export default function AdminAffiliateContests() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contests</h1>
          <p className="text-gray-500 mt-1">
            Manage promotional campaigns and contests
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Create Contest
        </Button>
      </div>

      <div className="space-y-4">
        {mockContests.map((contest) => (
          <Card key={contest.id}>
            <CardContent className="py-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <PartyPopper className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {contest.name}
                    </h3>
                    <Badge
                      variant={
                        contest.status === "active"
                          ? "success"
                          : contest.status === "draft"
                            ? "default"
                            : "warning"
                      }
                    >
                      {contest.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {contest.description}
                  </p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(contest.start_date).toLocaleDateString()} -{" "}
                      {new Date(contest.end_date).toLocaleDateString()}
                    </span>
                    <Badge variant="info">Metric: {contest.metric}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    <span className="font-medium">Prize:</span>{" "}
                    {contest.prize_description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
