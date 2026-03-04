"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockAffiliate } from "@/lib/mock-data";

export default function AffiliateSettings() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue={mockAffiliate.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={mockAffiliate.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral Code
                </label>
                <input
                  type="text"
                  defaultValue={mockAffiliate.referral_code}
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <Button>Save Changes</Button>
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
                  defaultValue={mockAffiliate.payment_method || ""}
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
                  defaultValue={mockAffiliate.payment_email || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <Button>Update Payment Info</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
