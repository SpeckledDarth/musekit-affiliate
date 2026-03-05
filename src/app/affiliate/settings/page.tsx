"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api-client";
import type { AffiliateProfile, ReferralLink } from "@/types";

export default function AffiliateSettings() {
  const [profile, setProfile] = useState<AffiliateProfile | null>(null);
  const [link, setLink] = useState<ReferralLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const [displayName, setDisplayName] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("");
  const [payoutEmail, setPayoutEmail] = useState("");

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
    setSaveMessage("");
    try {
      await api.affiliate.updateProfile({
        display_name: displayName || null,
      });
      setSaveMessage("Profile saved successfully!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      setSaveMessage("Failed to save profile.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const handleSavePayment = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      await api.affiliate.updateProfile({
        payout_method: payoutMethod || null,
        payout_email: payoutEmail || null,
      });
      setSaveMessage("Payment info updated successfully!");
    } catch (err) {
      console.error("Failed to update payment info:", err);
      setSaveMessage("Failed to update payment info.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(""), 3000);
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
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">
          Manage your affiliate account and payment information
        </p>
      </div>

      {saveMessage && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm">
          {saveMessage}
        </div>
      )}

      <div className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral Code
                </label>
                <input
                  type="text"
                  defaultValue={link?.ref_code || ""}
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={payoutMethod}
                  onChange={(e) => setPayoutMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Email
                </label>
                <input
                  type="email"
                  value={payoutEmail}
                  onChange={(e) => setPayoutEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
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
