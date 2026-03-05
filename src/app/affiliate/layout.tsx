"use client";

import { Sidebar } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  DollarSign,
  Wallet,
  FileText,
  Wrench,
  Newspaper,
  MessageSquare,
  Settings,
  HelpCircle,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/affiliate", icon: LayoutDashboard },
  { label: "Analytics", href: "/affiliate/analytics", icon: BarChart3 },
  { label: "Referrals", href: "/affiliate/referrals", icon: Users },
  { label: "Earnings", href: "/affiliate/earnings", icon: DollarSign },
  { label: "Payouts", href: "/affiliate/payouts", icon: Wallet },
  { label: "Resources", href: "/affiliate/resources", icon: FileText },
  { label: "Tools", href: "/affiliate/tools", icon: Wrench },
  { label: "News", href: "/affiliate/news", icon: Newspaper },
  { label: "Messages", href: "/affiliate/messages", icon: MessageSquare },
  { label: "Settings", href: "/affiliate/settings", icon: Settings },
  { label: "Support", href: "/affiliate/support", icon: HelpCircle },
];

export default function AffiliateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar
        title="Affiliate Portal"
        items={navItems}
        backHref="/"
        backLabel="&larr; Home"
      />
      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
