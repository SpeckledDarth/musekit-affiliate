"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { api } from "@/lib/api-client";

export default function AdminAffiliateSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [commissionRate, setCommissionRate] = useState("15");
  const [cookieDuration, setCookieDuration] = useState("30");
  const [minPayout, setMinPayout] = useState("50");
  const [payoutSchedule, setPayoutSchedule] = useState("monthly");
  const [autoApprove, setAutoApprove] = useState(false);
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await api.admin.getSettings();
        if (data) {
          setCommissionRate(String(data.commission_rate ?? "15"));
          setCookieDuration(String(data.cookie_duration ?? "30"));
          setMinPayout(String(data.min_payout_amount ?? "50"));
          setPayoutSchedule(String(data.payout_schedule ?? "monthly"));
          setAutoApprove(Boolean(data.auto_approve));
          setRequireEmailVerification(data.require_email_verification !== false);
        }
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  async function handleSaveCommission() {
    setSaving(true);
    try {
      await api.admin.updateSettings({
        commission_rate: Number(commissionRate),
        cookie_duration: Number(cookieDuration),
        min_payout_amount: Number(minPayout),
        payout_schedule: payoutSchedule,
      });
      toast.success("Commission settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveApproval() {
    setSaving(true);
    try {
      await api.admin.updateSettings({
        auto_approve: autoApprove,
        require_email_verification: requireEmailVerification,
      });
      toast.success("Approval settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Program Settings</h1>
          <p className="text-muted-foreground mt-1">
            Configure commission rates, cookie duration, and payout settings
          </p>
        </div>
        <div className="space-y-6 max-w-2xl">
          <Card>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Program Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure commission rates, cookie duration, and payout settings
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Commission Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Default Commission Rate (%)"
                type="number"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                min={0}
                max={100}
              />
              <Input
                label="Cookie Duration (days)"
                type="number"
                value={cookieDuration}
                onChange={(e) => setCookieDuration(e.target.value)}
                min={1}
              />
              <Input
                label="Minimum Payout Amount ($)"
                type="number"
                value={minPayout}
                onChange={(e) => setMinPayout(e.target.value)}
                min={0}
              />
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Payout Schedule
                </label>
                <select
                  value={payoutSchedule}
                  onChange={(e) => setPayoutSchedule(e.target.value)}
                  className="block w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <Button onClick={handleSaveCommission} disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Auto-Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={autoApprove}
                  onChange={(e) => setAutoApprove(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary-600"
                />
                <span className="text-sm text-foreground">
                  Auto-approve new affiliate applications
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={requireEmailVerification}
                  onChange={(e) => setRequireEmailVerification(e.target.checked)}
                  className="w-4 h-4 rounded border-border text-primary-600"
                />
                <span className="text-sm text-foreground">
                  Require email verification before activation
                </span>
              </label>
              <Button onClick={handleSaveApproval} disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
