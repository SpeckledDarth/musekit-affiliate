"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { api } from "@/lib/api-client";
import type { SupportTicket } from "@/types";

export default function AffiliateSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.affiliate.getSupportTickets();
        setTickets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load support tickets");
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
        {tickets.length === 0 && (
          <p className="text-gray-500 text-center py-8">No support tickets yet.</p>
        )}
        {tickets.map((ticket) => (
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
