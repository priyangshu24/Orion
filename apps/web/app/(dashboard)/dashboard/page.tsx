"use client";

import {
  WidgetTasks,
  WidgetCalendar,
  WidgetEmails,
  WidgetProductivity,
  WidgetFocusTimer,
  WidgetAI,
  WidgetQuickActions,
} from "@/features/dashboard";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h2 className="text-xl font-bold tracking-tight">
          Good morning, Alex
        </h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s on your plate today.
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WidgetTasks />
        </div>
        <WidgetProductivity />
        <WidgetCalendar />
        <WidgetFocusTimer />
        <WidgetEmails />
        <div className="lg:col-span-2">
          <WidgetAI />
        </div>
        <WidgetQuickActions />
      </div>
    </div>
  );
}
