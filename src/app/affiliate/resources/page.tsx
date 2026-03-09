"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
import { Tabs } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/components/ui/toast";
import { Copy, Download, Image, FileText, Share2, Mail, FolderOpen } from "lucide-react";
import { api } from "@/lib/api-client";
import type { AffiliateAsset } from "@/types";

const typeIcons: Record<string, React.ReactNode> = {
  banner: <Image className="w-5 h-5" />,
  text: <FileText className="w-5 h-5" />,
  social: <Share2 className="w-5 h-5" />,
  email: <Mail className="w-5 h-5" />,
};

const filterTabs = [
  { key: "all", label: "All" },
  { key: "banner", label: "Banner" },
  { key: "text", label: "Text" },
  { key: "social", label: "Social" },
  { key: "email", label: "Email" },
];

export default function AffiliateResources() {
  const [assets, setAssets] = useState<AffiliateAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("all");

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

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesType = activeType === "all" || asset.asset_type === activeType;
      const matchesSearch = !search || asset.title.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [assets, activeType, search]);

  const handleCopy = async (asset: AffiliateAsset) => {
    let textToCopy = "";
    if (asset.asset_type === "banner" && asset.file_url) {
      textToCopy = `<img src="${asset.file_url}" alt="${asset.title}" />`;
    } else {
      textToCopy = asset.content || asset.file_url || "";
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = (asset: AffiliateAsset) => {
    if (asset.file_url) {
      window.open(asset.file_url, "_blank");
    } else {
      toast.error("No file available for download");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-muted-foreground">Loading resources...</div>
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
        <h1 className="text-2xl font-bold text-foreground">
          Marketing Resources
        </h1>
        <p className="text-muted-foreground mt-1">
          Banners, copy, and promotional materials for your campaigns
        </p>
      </div>

      <div className="mb-6 space-y-4">
        <div className="max-w-sm">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search resources..."
          />
        </div>
        <Tabs tabs={filterTabs} activeTab={activeType} onChange={setActiveType} />
      </div>

      {assets.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="w-6 h-6 text-muted-foreground" />}
          title="No resources available yet"
          description="Marketing materials will appear here once they are added."
        />
      ) : filteredAssets.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="w-6 h-6 text-muted-foreground" />}
          title="No resources match your filter"
          description="Try adjusting your search or filter to find what you're looking for."
          actionLabel="Clear filters"
          onAction={() => { setSearch(""); setActiveType("all"); }}
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredAssets.map((asset) => (
            <Card key={asset.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                      {typeIcons[asset.asset_type] || <FileText className="w-5 h-5" />}
                    </div>
                    <div>
                      <CardTitle className="text-base">{asset.title}</CardTitle>
                      {asset.description && (
                        <span className="text-xs text-muted-foreground">
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
                  <div className="bg-muted rounded-lg p-4 text-center text-sm text-muted-foreground mb-4">
                    {asset.file_url ? (
                      <img src={asset.file_url} alt={asset.title} className="max-w-full h-auto mx-auto" />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
                        <Image className="w-10 h-10 mb-2" />
                        <span>No preview available</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3 mb-4">
                    {asset.content}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => handleCopy(asset)}>
                    <Copy className="w-4 h-4 mr-1" /> Copy
                  </Button>
                  {(asset.asset_type === "banner" || asset.file_url) && (
                    <Button variant="secondary" size="sm" onClick={() => handleDownload(asset)}>
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
