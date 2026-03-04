"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Download, Image, FileText, Share2, Mail } from "lucide-react";
import { mockAssets } from "@/lib/mock-data";

const typeIcons: Record<string, React.ReactNode> = {
  banner: <Image className="w-5 h-5" />,
  text: <FileText className="w-5 h-5" />,
  social: <Share2 className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
};

export default function AffiliateResources() {
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

      <div className="grid md:grid-cols-2 gap-6">
        {mockAssets.map((asset) => (
          <Card key={asset.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    {typeIcons[asset.type]}
                  </div>
                  <div>
                    <CardTitle className="text-base">{asset.name}</CardTitle>
                    {asset.dimensions && (
                      <span className="text-xs text-gray-400">
                        {asset.dimensions}
                      </span>
                    )}
                  </div>
                </div>
                <Badge>{asset.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {asset.type === "banner" ? (
                <div className="bg-gray-100 rounded-lg p-4 text-center text-sm text-gray-500 mb-4">
                  Banner Preview Placeholder ({asset.dimensions})
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
                {asset.type === "banner" && (
                  <Button variant="secondary" size="sm">
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
