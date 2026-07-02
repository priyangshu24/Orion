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
    <div className="flex flex-col items-stretch justify-start">
      <section className="mt-0 pt-0">
        <h2 className="text-xl font-bold tracking-tight">
          Good morning, Alex
        </h2>
        <p className="text-sm text-muted-foreground">
          Here&apos;s what&apos;s on your plate today.
        </p>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <WidgetTasks />
        </div>
        <WidgetProductivity />
        <WidgetCalendar />
        <WidgetFocusTimer />
        <WidgetEmails />
        <div className="xl:col-span-2">
          <WidgetAI />
        </div>
        <WidgetQuickActions />
      </section>
    </div>
  );
}
