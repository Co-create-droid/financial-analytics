"use client";

import { DashboardCharts } from "@/components/dashboard-charts";

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your financial data.</p>
      </div>
      
      <DashboardCharts />
    </div>
  );
}
