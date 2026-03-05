"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const networks = [
  {
    name: "ShareASale",
    status: "connected",
    affiliates: 120,
    url: "https://shareasale.com",
  },
  {
    name: "Impact",
    status: "not_connected",
    affiliates: 0,
    url: "https://impact.com",
  },
  {
    name: "CJ Affiliate",
    status: "not_connected",
    affiliates: 0,
    url: "https://cj.com",
  },
  {
    name: "Partnerize",
    status: "connected",
    affiliates: 45,
    url: "https://partnerize.com",
  },
];

export default function AdminAffiliateNetworks() {

  function handleConnect(name: string) {
    toast.success(`Connection request sent to ${name}`);
  }

  function handleManage(name: string, url: string) {
    toast.info(`Opening ${name} dashboard...`);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Network Integrations
        </h1>
        <p className="text-gray-500 mt-1">
          Connect with affiliate networks to expand your reach
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {networks.map((network) => (
          <Card key={network.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-gray-500" />
                  </div>
                  <CardTitle className="text-base">{network.name}</CardTitle>
                </div>
                <Badge
                  variant={
                    network.status === "connected" ? "success" : "default"
                  }
                >
                  {network.status === "connected"
                    ? "Connected"
                    : "Not Connected"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {network.status === "connected" ? (
                <div>
                  <p className="text-sm text-gray-600">
                    {network.affiliates} affiliates from this network
                  </p>
                  <a
                    href={network.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-1"
                  >
                    {network.url}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Connect to import affiliates from this network
                </p>
              )}
              <div className="mt-3">
                {network.status === "connected" ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleManage(network.name, network.url)}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" /> Manage
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleConnect(network.name)}
                  >
                    Connect
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
