"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Copy, Link, Code, Download, QrCode } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { api } from "@/lib/api-client";
import { generateReferralLink } from "@/core";
import type { ReferralLink } from "@/types";

export default function AffiliateTools() {
  const [campaign, setCampaign] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
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
    toast.success("Copied to clipboard!");
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector("#qr-code canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "referral-qr.png";
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  const defaultLink = generateReferralLink(refCode || "");
  const qrLink = generatedLink || defaultLink;

  const bannerCode = `<a href="${qrLink}">
  <img src="https://musekit.io/assets/banner-728x90.png" alt="MuseKit" width="728" height="90" />
</a>`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Affiliate Tools</h1>
        <p className="text-muted-foreground mt-1">
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
              <Input
                label="Campaign Name (optional)"
                type="text"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="e.g., youtube-review, instagram-bio"
              />
              <Button onClick={handleGenerate} disabled={!refCode}>
                Generate Link
              </Button>
              {generatedLink && (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    readOnly
                    value={generatedLink}
                    className="flex-1 bg-muted font-mono"
                  />
                  <Button
                    variant="secondary"
                    onClick={() => handleCopy(generatedLink)}
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary-600" />
              <CardTitle>QR Code</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div id="qr-code" className="p-4 bg-background rounded-lg border border-border">
                <QRCodeCanvas value={qrLink} size={200} />
              </div>
              <p className="text-sm text-muted-foreground text-center break-all max-w-md">
                {qrLink}
              </p>
              <Button variant="secondary" onClick={handleDownloadQR}>
                <Download className="w-4 h-4 mr-1" />
                Download QR Code
              </Button>
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
