"use client";

import { Sidebar } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  UserCheck,
  Settings,
  Image,
  Trophy,
  Crown,
  Megaphone,
  Users,
  Globe,
  PartyPopper,
  Wallet,
  Tag,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin/affiliates", icon: LayoutDashboard },
  {
    label: "Applications",
    href: "/admin/affiliates/applications",
    icon: UserCheck,
  },
  { label: "Members", href: "/admin/affiliates/members", icon: Users },
  { label: "Settings", href: "/admin/affiliates/settings", icon: Settings },
  { label: "Assets", href: "/admin/affiliates/assets", icon: Image },
  {
    label: "Milestones",
    href: "/admin/affiliates/milestones",
    icon: Trophy,
  },
  { label: "Tiers", href: "/admin/affiliates/tiers", icon: Crown },
  {
    label: "Broadcasts",
    href: "/admin/affiliates/broadcasts",
    icon: Megaphone,
  },
  { label: "Networks", href: "/admin/affiliates/networks", icon: Globe },
  {
    label: "Contests",
    href: "/admin/affiliates/contests",
    icon: PartyPopper,
  },
  {
    label: "Payout Runs",
    href: "/admin/affiliates/payout-runs",
    icon: Wallet,
  },
  {
    label: "Discount Codes",
    href: "/admin/affiliates/discount-codes",
    icon: Tag,
  },
];

export default function AdminAffiliatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar
        title="Affiliate Admin"
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
