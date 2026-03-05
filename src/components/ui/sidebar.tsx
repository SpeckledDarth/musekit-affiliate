"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  title: string;
  items: NavItem[];
  backHref?: string;
  backLabel?: string;
}

export function Sidebar({ title, items, backHref, backLabel }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        {backHref && (
          <Link
            href={backHref}
            className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-1 inline-block"
          >
            {backLabel || "Back"}
          </Link>
        )}
      </div>
      <nav className="px-3 flex-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700 dark:bg-gray-800 dark:text-primary-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200",
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <ThemeToggle />
      </div>
    </aside>
  );
}
