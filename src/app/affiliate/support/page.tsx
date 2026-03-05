"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { Plus, Send } from "lucide-react";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/format";
import type { SupportTicket, TicketReply } from "@/types";

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const categoryOptions = [
  { value: "general", label: "General" },
  { value: "technical", label: "Technical" },
  { value: "billing", label: "Billing" },
  { value: "feature_request", label: "Feature Request" },
];

const columns = [
  { key: "subject", header: "Subject" },
  {
    key: "status",
    header: "Status",
    render: (item: SupportTicket) => (
      <Badge
        variant={
          item.status === "resolved"
            ? "success"
            : item.status === "open"
              ? "info"
              : item.status === "closed"
                ? "default"
                : "warning"
        }
      >
        {item.status.replace("_", " ")}
      </Badge>
    ),
  },
  {
    key: "priority",
    header: "Priority",
    render: (item: SupportTicket) => (
      <Badge
        variant={
          item.priority === "high"
            ? "danger"
            : item.priority === "medium"
              ? "warning"
              : "default"
        }
      >
        {item.priority}
      </Badge>
    ),
  },
  {
    key: "category",
    header: "Category",
    render: (item: SupportTicket) => item.category ?? "—",
  },
  {
    key: "created_at",
    header: "Created",
    render: (item: SupportTicket) => formatDate(item.created_at),
  },
];

const statusFilterOptions = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
];

const priorityFilterOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export default function AffiliateSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailTicket, setDetailTicket] = useState<SupportTicket | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [category, setCategory] = useState("general");
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [repliesLoading, setRepliesLoading] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const repliesEndRef = useRef<HTMLDivElement>(null);

  const loadTickets = useCallback(async () => {
    try {
      const data = await api.affiliate.getSupportTickets();
      setTickets(data);
    } catch {
      toast.error("Failed to load support tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const loadReplies = useCallback(async (ticketId: string) => {
    setRepliesLoading(true);
    try {
      const data = await api.affiliate.getTicketReplies(ticketId);
      setReplies(data);
    } catch {
      toast.error("Failed to load replies");
    } finally {
      setRepliesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (detailTicket) {
      loadReplies(detailTicket.id);
      setReplyBody("");
    } else {
      setReplies([]);
    }
  }, [detailTicket, loadReplies]);

  useEffect(() => {
    if (repliesEndRef.current) {
      repliesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [replies]);

  const handleSendReply = async () => {
    if (!replyBody.trim() || !detailTicket) return;
    setSendingReply(true);
    try {
      await api.affiliate.addTicketReply(detailTicket.id, replyBody.trim());
      setReplyBody("");
      await loadReplies(detailTicket.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reply");
    } finally {
      setSendingReply(false);
    }
  };

  const handleCreate = async () => {
    if (!subject.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      await api.affiliate.createSupportTicket({ subject, description, priority, category });
      toast.success("Ticket created!");
      setCreateOpen(false);
      setSubject("");
      setDescription("");
      setPriority("low");
      setCategory("general");
      setLoading(true);
      await loadTickets();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support</h1>
          <p className="text-gray-500 mt-1">Get help with your affiliate account</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> New Ticket
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={tickets}
        loading={loading}
        searchable={true}
        searchPlaceholder="Search tickets..."
        filters={[
          { key: "status", label: "Status", options: statusFilterOptions },
          { key: "priority", label: "Priority", options: priorityFilterOptions },
        ]}
        onRowClick={(item) => setDetailTicket(item)}
        emptyMessage="No support tickets yet."
        exportable
        exportFilename="support-tickets"
      />

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Support Ticket"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={submitting || !subject.trim() || !description.trim()}>
              {submitting ? "Creating..." : "Create Ticket"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief summary of your issue"
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your issue in detail"
          />
          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={priorityOptions}
          />
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={categoryOptions}
          />
        </div>
      </Modal>

      <Modal
        open={!!detailTicket}
        onClose={() => setDetailTicket(null)}
        title={detailTicket?.subject ?? "Ticket Details"}
        size="lg"
      >
        {detailTicket && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{detailTicket.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1">
                  <Badge
                    variant={
                      detailTicket.status === "resolved"
                        ? "success"
                        : detailTicket.status === "open"
                          ? "info"
                          : detailTicket.status === "closed"
                            ? "default"
                            : "warning"
                    }
                  >
                    {detailTicket.status.replace("_", " ")}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Priority</p>
                <div className="mt-1">
                  <Badge
                    variant={
                      detailTicket.priority === "high"
                        ? "danger"
                        : detailTicket.priority === "medium"
                          ? "warning"
                          : "default"
                    }
                  >
                    {detailTicket.priority}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="mt-1 text-gray-900">{detailTicket.category ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ticket Number</p>
                <p className="mt-1 text-gray-900">{detailTicket.ticket_number ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="mt-1 text-gray-900">{formatDate(detailTicket.created_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Updated</p>
                <p className="mt-1 text-gray-900">{formatDate(detailTicket.updated_at)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="mt-1 text-gray-900">{formatDate(detailTicket.resolved_at)}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-500 mb-3">Replies</p>
              <div className="max-h-64 overflow-y-auto space-y-3 mb-4">
                {repliesLoading ? (
                  <p className="text-sm text-gray-400">Loading replies...</p>
                ) : replies.length === 0 ? (
                  <p className="text-sm text-gray-400">No replies yet.</p>
                ) : (
                  replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-3 rounded-lg text-sm ${
                        reply.sender_role === "affiliate"
                          ? "bg-blue-50 border border-blue-100 ml-8"
                          : "bg-gray-50 border border-gray-100 mr-8"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-700">
                          {reply.sender_role === "affiliate" ? "You" : "Support"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(reply.created_at)}
                        </span>
                      </div>
                      <p className="text-gray-900 whitespace-pre-wrap">{reply.body}</p>
                    </div>
                  ))
                )}
                <div ref={repliesEndRef} />
              </div>
              <div className="flex gap-2">
                <Textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  placeholder="Type your reply..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendReply}
                  disabled={sendingReply || !replyBody.trim()}
                  className="self-end"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
