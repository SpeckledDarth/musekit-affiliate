"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Link, Code } from "lucide-react";
import { api } from "@/lib/api-client";
import { generateReferralLink } from "@/core";
import type { ReferralLink } from "@/types";

export default function AffiliateTools() {
  const [campaign, setCampaign] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const links = await api.affiliate.getReferralLinks();
        if (links.length > 0) {
          setRefCode(links[0].ref_code);
        }
      } catch (err) {
        console.error("Failed to load referral data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleGenerate = () => {
    if (!refCode) return;
    const link = generateReferralLink(refCode, campaign || undefined);
    setGeneratedLink(link);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const bannerCode = `<a href="${generatedLink || generateReferralLink(refCode || "")}">
  <img src="https://musekit.io/assets/banner-728x90.png" alt="MuseKit" width="728" height="90" />
</a>`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Affiliate Tools</h1>
        <p className="text-gray-500 mt-1">
          Generate tracking links and embed codes
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link className="w-5 h-5 text-primary-600" />
              <CardTitle>Link Generator</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name (optional)
                </label>
                <input
                  type="text"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="e.g., youtube-review, instagram-bio"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <Button onClick={handleGenerate} disabled={!refCode}>
                Generate Link
              </Button>
              {generatedLink && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-mono"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => handleCopy(generatedLink)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary-600" />
              <CardTitle>Banner Embed Code</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
              {bannerCode}
            </pre>
            <Button
              variant="secondary"
              className="mt-3"
              onClick={() => handleCopy(bannerCode)}
            >
              <Copy className="w-4 h-4 mr-1" /> Copy Embed Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
