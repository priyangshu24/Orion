"use client";

import { CalendarDays, Plus } from "lucide-react";
import {
  ActivityFeed,
  AiAskPanel,
  AiInsights,
  IntegrationsRow,
  RevenueChart,
  SalesPipeline,
  StatCards,
  TasksPanel,
  TopDeals,
} from "@/features/dashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-3">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-foreground">
            Good morning, Alex <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Here&apos;s what&apos;s happening with your business today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="orion-glass-control flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] text-foreground transition hover:bg-foreground/[0.09]"
          >
            May 20, 2024
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            className="orion-add-widget flex items-center gap-2 rounded-lg px-3.5 py-2 text-[11px] font-semibold text-primary-foreground transition hover:brightness-110 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Add Widget
          </button>
        </div>
      </header>

      <StatCards />

      {/* Revenue leads, then the two list panels. Explicit fractions rather
          than four equal columns: the deals list needs more room than an even
          split gives it, or company names truncate at 1280-1366px. */}
      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-[1.7fr_1fr_1.18fr]">
        <div className="lg:col-span-2 xl:col-span-1">
          <RevenueChart />
        </div>
        <ActivityFeed />
        <TopDeals />
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
        <TasksPanel />
        <AiAskPanel />
        <SalesPipeline />
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <IntegrationsRow />
        <AiInsights />
      </section>
    </div>
  );
}
