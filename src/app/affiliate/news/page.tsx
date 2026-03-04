"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Megaphone } from "lucide-react";
import { mockBroadcasts } from "@/lib/mock-data";

export default function AffiliateNews() {
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
        {mockBroadcasts.map((broadcast) => (
          <Card key={broadcast.id}>
            <CardContent className="py-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {broadcast.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {broadcast.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(broadcast.sent_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
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
