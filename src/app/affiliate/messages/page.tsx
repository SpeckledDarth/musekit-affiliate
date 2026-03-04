"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, User, Shield } from "lucide-react";
import { mockMessages } from "@/lib/mock-data";

export default function AffiliateMessages() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 mt-1">
            Communication with the affiliate team
          </p>
        </div>
        <Button>
          <Send className="w-4 h-4 mr-2" /> New Message
        </Button>
      </div>

      <div className="space-y-3">
        {mockMessages.map((message) => (
          <Card
            key={message.id}
            className={!message.read ? "border-primary-200 bg-primary-50/30" : ""}
          >
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender_type === "admin"
                      ? "bg-accent-100 text-accent-600"
                      : "bg-primary-100 text-primary-600"
                  }`}
                >
                  {message.sender_type === "admin" ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">
                      {message.subject}
                    </h3>
                    {!message.read && <Badge variant="primary">New</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {message.content}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(message.created_at).toLocaleDateString()} -{" "}
                    {message.sender_type === "admin" ? "Admin" : "You"}
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
