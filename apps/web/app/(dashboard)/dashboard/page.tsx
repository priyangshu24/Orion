"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Check, Plus, X } from "lucide-react";
import { toast } from "sonner";
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
  WidgetCalendar,
  WidgetFocusTimer,
  WidgetQuickActions,
} from "@/features/dashboard";

const availableWidgets = [
  {
    id: "quick-actions",
    title: "Quick Actions",
    description: "Shortcuts for common CRM workflows.",
    component: WidgetQuickActions,
  },
  {
    id: "calendar",
    title: "Upcoming Schedule",
    description: "Your next meetings and events.",
    component: WidgetCalendar,
  },
  {
    id: "focus-timer",
    title: "Focus Timer",
    description: "A focused work timer for priority tasks.",
    component: WidgetFocusTimer,
  },
] as const;

export default function DashboardPage() {
  const router = useRouter();
  const [widgetPickerOpen, setWidgetPickerOpen] = useState(false);
  const [addedWidgetIds, setAddedWidgetIds] = useState<string[]>([]);

  useEffect(() => {
    if (!widgetPickerOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWidgetPickerOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [widgetPickerOpen]);

  function addWidget(widgetId: string, title: string) {
    setAddedWidgetIds((current) =>
      current.includes(widgetId) ? current : [...current, widgetId]
    );
    toast.success(`${title} added to your dashboard`);
  }

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
            onClick={() => router.push("/calendar")}
            className="orion-glass-control flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] text-foreground transition hover:bg-foreground/[0.09]"
            aria-label="Open calendar for May 20, 2024"
          >
            May 20, 2024
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </button>
          <button
            type="button"
            onClick={() => setWidgetPickerOpen(true)}
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

      {addedWidgetIds.length > 0 ? (
        <section aria-label="Added widgets" className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-3">
          {addedWidgetIds.map((widgetId) => {
            const widget = availableWidgets.find((item) => item.id === widgetId);
            if (!widget) return null;
            const Widget = widget.component;
            return <Widget key={widget.id} />;
          })}
        </section>
      ) : null}

      {widgetPickerOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="widget-picker-title">
          <button
            type="button"
            aria-label="Close widget picker"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            onClick={() => setWidgetPickerOpen(false)}
          />
          <section className="neon-panel relative z-10 w-full max-w-lg rounded-2xl p-5 shadow-floating">
            <header className="flex items-start justify-between gap-4">
              <div>
                <h2 id="widget-picker-title" className="text-base font-semibold text-foreground">Add a widget</h2>
                <p className="mt-1 text-xs text-muted-foreground">Customize your dashboard with the tools you use most.</p>
              </div>
              <button
                type="button"
                onClick={() => setWidgetPickerOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-foreground/[0.07] hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="mt-4 grid gap-2">
              {availableWidgets.map((widget) => {
                const added = addedWidgetIds.includes(widget.id);
                return (
                  <button
                    key={widget.id}
                    type="button"
                    disabled={added}
                    onClick={() => addWidget(widget.id, widget.title)}
                    className="orion-glass-control flex items-center gap-3 rounded-xl p-3 text-left transition hover:border-primary/35 disabled:cursor-default disabled:opacity-70"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">{widget.title}</span>
                      <span className="block text-[11px] text-muted-foreground">{widget.description}</span>
                    </span>
                    <span className="text-[10px] font-medium text-primary">{added ? "Added" : "Add"}</span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
