"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, Image, FileText, Share2, Mail } from "lucide-react";
import { api } from "@/lib/api-client";
import type { AffiliateAsset } from "@/types";

const typeIcons: Record<string, React.ReactNode> = {
  banner: <Image className="w-5 h-5" />,
  text: <FileText className="w-5 h-5" />,
  social: <Share2 className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
};

export default function AffiliateResources() {
  const [assets, setAssets] = useState<AffiliateAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.affiliate.getResources();
        setAssets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-gray-500">Loading resources...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Marketing Resources
        </h1>
        <p className="text-gray-500 mt-1">
          Banners, copy, and promotional materials for your campaigns
        </p>
      </div>

      {assets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No resources available yet
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {assets.map((asset) => (
            <Card key={asset.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                      {typeIcons[asset.asset_type] || <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <CardTitle className="text-base">{asset.title}</CardTitle>
                      {asset.description && (
                        <span className="text-xs text-gray-400">
                          {asset.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge>{asset.asset_type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {asset.asset_type === "banner" ? (
                  <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-500 mb-4">
                    {asset.file_url ? (
                      <img src={asset.file_url} alt={asset.title} className="max-w-full h-auto mx-auto" />
                    ) : (
                      `Banner Preview Placeholder`
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-4">
                    {asset.content}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm">
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                  {(asset.asset_type === "banner" || asset.file_url) && (
                    <Button variant="secondary" size="sm">
                      <Download className="w-4 h-4 mr-1" /> Download
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
