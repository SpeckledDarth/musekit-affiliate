"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toast } from "@/components/ui/toast";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { api } from "@/lib/api-client";
import type { AffiliateProfile, ReferralLink } from "@/types";

const paymentMethodOptions = [
  { value: "paypal", label: "PayPal" },
  { value: "stripe", label: "Stripe" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

export default function AffiliateSettings() {
  const [profile, setProfile] = useState<AffiliateProfile | null>(null);
  const [link, setLink] = useState<ReferralLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("");
  const [payoutEmail, setPayoutEmail] = useState("");

  const isDirty = useMemo(() => {
    if (!profile) return false;
    return (
      displayName !== (profile.display_name || "") ||
      payoutMethod !== (profile.payout_method || "paypal") ||
      payoutEmail !== (profile.payout_email || "")
    );
  }, [displayName, payoutMethod, payoutEmail, profile]);

  useUnsavedChanges(isDirty);

  useEffect(() => {
    async function load() {
      try {
        const [profileData, links] = await Promise.all([
          api.affiliate.getProfile(),
          api.affiliate.getReferralLinks(),
        ]);
        setProfile(profileData);
        if (links.length > 0) setLink(links[0]);
        if (profileData) {
          setDisplayName(profileData.display_name || "");
          setPayoutMethod(profileData.payout_method || "paypal");
          setPayoutEmail(profileData.payout_email || "");
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await api.affiliate.updateProfile({
        display_name: displayName || null,
      });
      setProfile(updated);
      toast.success("Profile saved successfully!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePayment = async () => {
    setSaving(true);
    try {
      const updated = await api.affiliate.updateProfile({
        payout_method: payoutMethod || null,
        payout_email: payoutEmail || null,
      });
      setProfile(updated);
      toast.success("Payment info updated!");
    } catch (err) {
      console.error("Failed to update payment info:", err);
      toast.error("Failed to update payment info");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your affiliate account and payment information
        </p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                label="Display Name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <Input
                label="Referral Code"
                type="text"
                defaultValue={link?.ref_code || ""}
                disabled
              />
              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Select
                label="Payment Method"
                options={paymentMethodOptions}
                value={payoutMethod}
                onChange={(e) => setPayoutMethod(e.target.value)}
              />
              <Input
                label="Payment Email"
                type="email"
                value={payoutEmail}
                onChange={(e) => setPayoutEmail(e.target.value)}
              />
              <Button onClick={handleSavePayment} disabled={saving}>
                {saving ? "Saving..." : "Update Payment Info"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
