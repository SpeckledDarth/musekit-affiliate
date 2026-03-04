"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone, Users } from "lucide-react";
import { mockBroadcasts } from "@/lib/mock-data";

export default function AdminAffiliateBroadcasts() {
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
        {mockBroadcasts.map((broadcast) => (
          <Card key={broadcast.id}>
            <CardContent className="py-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {broadcast.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {broadcast.content}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>
                      {new Date(broadcast.sent_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {broadcast.recipient_count} recipients
                    </span>
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
