"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { mockSupportTickets } from "@/lib/mock-data";

export default function AffiliateSupport() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support</h1>
          <p className="text-gray-500 mt-1">Get help with your affiliate account</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New Ticket
        </Button>
      </div>

      <div className="space-y-4">
        {mockSupportTickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{ticket.subject}</h3>
                  <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Created {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      ticket.priority === "high"
                        ? "danger"
                        : ticket.priority === "medium"
                          ? "warning"
                          : "default"
                    }
                  >
                    {ticket.priority}
                  </Badge>
                  <Badge
                    variant={
                      ticket.status === "resolved"
                        ? "success"
                        : ticket.status === "open"
                          ? "info"
                          : "warning"
                    }
                  >
                    {ticket.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
