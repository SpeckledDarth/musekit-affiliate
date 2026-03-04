"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink } from "lucide-react";

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
                <p className="text-sm text-gray-600">
                  {network.affiliates} affiliates from this network
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  Connect to import affiliates from this network
                </p>
              )}
              <div className="mt-3">
                <Button
                  variant={
                    network.status === "connected" ? "secondary" : "primary"
                  }
                  size="sm"
                >
                  {network.status === "connected" ? (
                    <>
                      <ExternalLink className="w-4 h-4 mr-1" /> Manage
                    </>
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
