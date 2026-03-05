"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone, Users } from "lucide-react";
import { api } from "@/lib/api-client";
import type { AffiliateBroadcast } from "@/types";

export default function AdminAffiliateBroadcasts() {
  const [broadcasts, setBroadcasts] = useState<AffiliateBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.admin.getBroadcasts()
      .then(setBroadcasts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        Failed to load broadcasts: {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Broadcasts</h1>
          <p className="text-gray-500 mt-1">
            Send announcements to all affiliates
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New Broadcast
        </Button>
      </div>

      <div className="space-y-4">
        {broadcasts.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No broadcasts yet.
            </CardContent>
          </Card>
        ) : (
          broadcasts.map((broadcast) => (
            <Card key={broadcast.id}>
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Megaphone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {broadcast.subject}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {broadcast.body}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span>
                        {broadcast.sent_at
                          ? new Date(broadcast.sent_at).toLocaleDateString()
                          : new Date(broadcast.created_at).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {broadcast.sent_count} recipients
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
