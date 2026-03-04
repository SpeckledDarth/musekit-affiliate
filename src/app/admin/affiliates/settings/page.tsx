"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminAffiliateSettings() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Program Settings</h1>
        <p className="text-gray-500 mt-1">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Commission Rate (%)
                </label>
                <input
                  type="number"
                  defaultValue={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cookie Duration (days)
                </label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Payout Amount ($)
                </label>
                <input
                  type="number"
                  defaultValue={50}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payout Schedule
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500">
                  <option value="monthly">Monthly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              <Button>Save Settings</Button>
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
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                <span className="text-sm text-gray-700">
                  Auto-approve new affiliate applications
                </span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-gray-300 text-primary-600" />
                <span className="text-sm text-gray-700">
                  Require email verification before activation
                </span>
              </label>
              <Button>Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
