"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Image, FileText, Share2, Mail, Trash2 } from "lucide-react";
import { api } from "@/lib/api-client";
import type { AffiliateAsset } from "@/types";

const typeIcons: Record<string, React.ReactNode> = {
  banner: <Image className="w-5 h-5" />,
  text: <FileText className="w-5 h-5" />,
  social: <Share2 className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
};

export default function AdminAffiliateAssets() {
  const [assets, setAssets] = useState<AffiliateAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.admin.getAssets();
        setAssets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load assets");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    setDeleting(id);
    try {
      await api.admin.deleteAsset(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading assets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

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

      {assets.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            No assets available
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assets.map((asset) => (
            <Card key={asset.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                      {typeIcons[asset.asset_type] || <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{asset.title}</h3>
                      <p className="text-xs text-gray-500">
                        {asset.asset_type} — Created{" "}
                        {new Date(asset.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge>{asset.asset_type}</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={deleting === asset.id}
                      onClick={() => handleDelete(asset.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
