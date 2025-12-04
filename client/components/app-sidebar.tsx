"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Search, FileText, Settings, LogOut, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Analytics", href: "/analytics", icon: PieChart },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl hidden md:flex flex-col h-screen sticky top-0 pb-16">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-2 font-bold text-xl text-primary">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <PieChart className="w-5 h-5" />
          </div>
          FinAI
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="text-xs font-semibold text-muted-foreground mb-4 px-2 uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 mb-1",
                  isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* <div className="p-4 border-t border-border/50">
        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div> */}
    </aside>
  );
}
