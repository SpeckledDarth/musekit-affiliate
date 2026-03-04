"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Image, FileText, Share2, Mail, Trash2 } from "lucide-react";
import { mockAssets } from "@/lib/mock-data";

const typeIcons: Record<string, React.ReactNode> = {
  banner: <Image className="w-5 h-5" />,
  text: <FileText className="w-5 h-5" />,
  social: <Share2 className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
};

export default function AdminAffiliateAssets() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Marketing Assets
          </h1>
          <p className="text-gray-500 mt-1">
            Upload and manage marketing materials for affiliates
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Asset
        </Button>
      </div>

      <div className="space-y-4">
        {mockAssets.map((asset) => (
          <Card key={asset.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                    {typeIcons[asset.type]}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{asset.name}</h3>
                    <p className="text-xs text-gray-500">
                      {asset.dimensions || asset.type} - Created{" "}
                      {new Date(asset.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{asset.type}</Badge>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
