"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Megaphone, Eye, MousePointerClick } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import type { AffiliateBroadcast } from "@/types";

export default function AffiliateNews() {
  const [broadcasts, setBroadcasts] = useState<AffiliateBroadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AffiliateBroadcast | null>(null);

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
          <EmptyState
            icon={<Megaphone className="w-6 h-6 text-gray-400" />}
            title="No announcements yet"
            description="Check back later for news and updates from the affiliate program."
          />
        )}
        {broadcasts.map((broadcast) => (
          <div
            key={broadcast.id}
            className="cursor-pointer"
            onClick={() => setSelected(broadcast)}
          >
          <Card
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="py-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {broadcast.subject}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {broadcast.body}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {broadcast.category && (
                      <Badge variant="primary">{broadcast.category}</Badge>
                    )}
                    <p className="text-xs text-gray-400">
                      {broadcast.sent_at ? formatDate(broadcast.sent_at) : "Draft"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        ))}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.subject}
        size="lg"
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {selected.category && (
                <Badge variant="primary">{selected.category}</Badge>
              )}
              <span className="text-sm text-gray-500">
                {selected.sent_at ? formatDate(selected.sent_at) : "Draft"}
              </span>
            </div>

            <div className="text-gray-700 whitespace-pre-wrap">{selected.body}</div>

            {(selected.opened_count > 0 || selected.clicked_count > 0) && (
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                {selected.opened_count > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    <span>{selected.opened_count} opened</span>
                  </div>
                )}
                {selected.clicked_count > 0 && (
                  <div className="flex items-center gap-1.5 text-sm text-gray-500">
                    <MousePointerClick className="w-4 h-4" />
                    <span>{selected.clicked_count} clicked</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
