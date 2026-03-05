"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone } from "lucide-react";
import { api } from "@/lib/api-client";
import type { AffiliateBroadcast } from "@/types";

export default function AffiliateNews() {
  const [broadcasts, setBroadcasts] = useState<AffiliateBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.affiliate.getBroadcasts();
        setBroadcasts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load broadcasts");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          News & Announcements
        </h1>
        <p className="text-gray-500 mt-1">
          Updates and announcements from the affiliate program
        </p>
      </div>

      <div className="space-y-4">
        {broadcasts.length === 0 && (
          <p className="text-gray-500 text-center py-8">No announcements yet.</p>
        )}
        {broadcasts.map((broadcast) => (
          <Card key={broadcast.id}>
            <CardContent className="py-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {broadcast.subject}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {broadcast.body}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {broadcast.sent_at
                      ? new Date(broadcast.sent_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Draft"}
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
