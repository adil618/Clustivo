"use client";

import Link from "next/link";

const STATS = [
  { label: "Total Cities", icon: "🏙️", href: "/admin/city" },
  { label: "Total Areas", icon: "📍", href: "/admin/area" },
  { label: "Avatars", icon: "🖼️", href: "/admin/avatar" },
  { label: "Interests", icon: "⭐", href: "/admin/interests" },
  { label: "Discovery Ranges", icon: "📡", href: "/admin/discovery-range" },
];

const QUICK_LINKS = [
  { title: "Manage Cities", desc: "Add, edit, or remove cities", icon: "🏙️", href: "/admin/city" },
  { title: "Manage Areas", desc: "Assign areas to cities", icon: "📍", href: "/admin/area" },
  { title: "Manage Avatars", desc: "Upload and organize avatars", icon: "🖼️", href: "/admin/avatar" },
  { title: "Manage Interests", desc: "Configure user interest tags", icon: "⭐", href: "/admin/interests" },
  { title: "Discovery Ranges", desc: "Set distance options for discovery", icon: "📡", href: "/admin/discovery-range" },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your Clustivo platform.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STATS.map((s) => (
          <Link key={s.label} href={s.href} className="no-underline">
            <div className="rounded-xl border bg-card p-5 flex flex-col gap-3 hover:border-primary transition-colors cursor-pointer group">
              <span className="text-3xl">{s.icon}</span>
              <p className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                {s.label}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_LINKS.map((item) => (
            <Link key={item.title} href={item.href} className="no-underline">
              <div className="rounded-xl border bg-card p-5 flex items-start gap-4 hover:border-primary transition-colors group cursor-pointer">
                <span className="text-2xl mt-0.5">{item.icon}</span>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* API status note */}
      <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-5 flex items-start gap-4">
        <span className="text-2xl">⚡</span>
        <div>
          <p className="font-semibold text-foreground">API Integration Active</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Connected to{" "}
            <code className="text-primary text-xs bg-muted px-1.5 py-0.5 rounded">
              https://api.clustivo.com/api/v1
            </code>{" "}
            — all modules are managed from this dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}