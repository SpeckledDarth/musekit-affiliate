"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toast";
import { Send, User, Shield, MessageSquare } from "lucide-react";
import { api } from "@/lib/api-client";
import { relativeTime } from "@/lib/format";
import type { AffiliateMessage } from "@/types";

export default function AffiliateMessages() {
  const [messages, setMessages] = useState<AffiliateMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [sending, setSending] = useState(false);

  async function loadMessages() {
    try {
      const data = await api.affiliate.getMessages();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  async function handleSend() {
    if (!messageBody.trim()) return;
    setSending(true);
    try {
      await api.affiliate.sendMessage(messageBody.trim());
      toast.success("Message sent!");
      setMessageBody("");
      setModalOpen(false);
      await loadMessages();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  async function handleMarkRead(id: string) {
    try {
      await api.affiliate.markMessageRead(id);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, is_read: true, read_at: new Date().toISOString() } : m
        )
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to mark as read");
    }
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 mt-1">
            Communication with the affiliate team
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Send className="w-4 h-4 mr-2" /> New Message
        </Button>
      </div>

      <div className="space-y-3">
        {messages.length === 0 && (
          <EmptyState
            icon={<MessageSquare className="w-6 h-6 text-gray-400" />}
            title="No messages yet"
            description="Start a conversation with the affiliate team."
            actionLabel="New Message"
            onAction={() => setModalOpen(true)}
          />
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => {
              if (!message.is_read) handleMarkRead(message.id);
            }}
            className={!message.is_read ? "cursor-pointer" : ""}
          >
          <Card
            className={!message.is_read ? "border-primary-200 bg-primary-50/30" : ""}
          >
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender_role === "admin"
                      ? "bg-accent-100 text-accent-600"
                      : "bg-primary-100 text-primary-600"
                  }`}
                >
                  {message.sender_role === "admin" ? (
                    <Shield className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">
                      Message
                    </h3>
                    {!message.is_read && <Badge variant="primary">New</Badge>}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {message.body}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {relativeTime(message.created_at)} -{" "}
                    {message.sender_role === "admin" ? "Admin" : "You"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
        ))}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Message"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSend} disabled={sending || !messageBody.trim()}>
              {sending ? "Sending..." : "Send"}
            </Button>
          </>
        }
      >
        <Textarea
          label="Message"
          placeholder="Type your message..."
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          rows={5}
        />
      </Modal>
    </div>
  );
}
