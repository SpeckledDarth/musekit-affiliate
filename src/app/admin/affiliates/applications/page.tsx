"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { api } from "@/lib/api-client";
import type { AffiliateApplication } from "@/types";

export default function AffiliateApplications() {
  const [applications, setApplications] = useState<AffiliateApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.admin.getApplications();
        setApplications(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load applications");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleAction(id: string, status: "approved" | "rejected") {
    setActionLoading(id);
    try {
      await api.admin.updateApplication(id, status);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading applications...</div>
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

  const pendingApps = applications.filter((a) => a.status === "pending");
  const reviewedApps = applications.filter((a) => a.status !== "pending");

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
        <div className="space-y-4 mb-8">
          {pendingApps.map((app) => (
            <Card key={app.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{app.name}</h3>
                    <p className="text-sm text-gray-500">{app.email}</p>
                    {app.website_url && (
                      <p className="text-xs text-gray-400">{app.website_url}</p>
                    )}
                    {app.message && (
                      <p className="text-sm text-gray-600 mt-1">{app.message}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Applied{" "}
                      {new Date(app.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="warning">Pending Review</Badge>
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={actionLoading === app.id}
                      onClick={() => handleAction(app.id, "rejected")}
                    >
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      disabled={actionLoading === app.id}
                      onClick={() => handleAction(app.id, "approved")}
                    >
                      <Check className="w-4 h-4 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {reviewedApps.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reviewed</h2>
          <div className="space-y-4">
            {reviewedApps.map((app) => (
              <Card key={app.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{app.name}</h3>
                      <p className="text-sm text-gray-500">{app.email}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Applied {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={app.status === "approved" ? "success" : "danger"}
                    >
                      {app.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
