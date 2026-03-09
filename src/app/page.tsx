import Link from "next/link";
import {
  Users,
  BarChart3,
  DollarSign,
  Shield,
  ArrowRight,
  Zap,
  Target,
  Gift,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <nav className="bg-card border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              MuseKit Affiliate
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/affiliate"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Affiliate Dashboard
            </Link>
            <Link
              href="/admin/affiliates"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            MuseKit Affiliate Program
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Earn commissions by referring creators and musicians to MuseKit.
            Track your referrals, manage payouts, and grow your affiliate
            business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Link
            href="/affiliate"
            className="group bg-card rounded-lg border border-border p-8 hover:border-primary-400 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                Affiliate Dashboard
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              View your earnings, track referrals, access marketing materials,
              and manage your affiliate account.
            </p>
            <span className="inline-flex items-center gap-1 text-primary-600 font-medium group-hover:gap-2 transition-all">
              Open Dashboard <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          <Link
            href="/admin/affiliates"
            className="group bg-card rounded-lg border border-border p-8 hover:border-accent-400 hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent-600" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                Admin Panel
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Manage applications, set commission rates, process payouts, and
              oversee the affiliate program.
            </p>
            <span className="inline-flex items-center gap-1 text-accent-600 font-medium group-hover:gap-2 transition-all">
              Open Admin <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Users,
              label: "Active Affiliates",
              value: "1,247",
              color: "primary",
            },
            {
              icon: DollarSign,
              label: "Total Commissions",
              value: "$84,320",
              color: "green",
            },
            {
              icon: Target,
              label: "Conversion Rate",
              value: "12.4%",
              color: "blue",
            },
            {
              icon: Gift,
              label: "Active Campaigns",
              value: "8",
              color: "purple",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-lg border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <span className="text-2xl font-bold text-foreground">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
