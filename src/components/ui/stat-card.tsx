import { Card } from "./card";
import { clsx } from "clsx";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon?: LucideIcon;
}

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {Icon && <Icon className="w-5 h-5 text-muted-foreground" />}
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {change && (
        <p
          className={clsx(
            "text-sm mt-1",
            changeType === "positive" && "text-green-600",
            changeType === "negative" && "text-red-600",
            changeType === "neutral" && "text-muted-foreground",
          )}
        >
          {change}
        </p>
      )}
    </Card>
  );
}
