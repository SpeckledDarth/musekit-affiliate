"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { mockAffiliates } from "@/lib/mock-data";

export default function AffiliateApplications() {
  const pendingApps = mockAffiliates.filter((a) => a.status === "pending");

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Affiliate Applications
        </h1>
        <p className="text-gray-500 mt-1">
          Review and manage affiliate applications
        </p>
      </div>

      {pendingApps.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No pending applications
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingApps.map((app) => (
            <Card key={app.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{app.name}</h3>
                    <p className="text-sm text-gray-500">{app.email}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Applied{" "}
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="warning">Pending Review</Badge>
                    <Button size="sm" variant="secondary">
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button size="sm">
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
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
