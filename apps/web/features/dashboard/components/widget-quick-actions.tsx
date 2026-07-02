"use client";

import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
import { quickActions } from "../constants/mock-data";
import { Plus } from "lucide-react";

const routes: Record<string, string> = {
  "New Task": "/tasks",
  "New Email": "/emails",
  "New Meeting": "/calendar",
  "Ask Nova": "/ai",
};

export function WidgetQuickActions() {
  const router = useRouter();

  return (
    <Card className="group hover:shadow-card-hover transition-all duration-200">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => router.push(routes[action.label] ?? "/dashboard")}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm transition-all hover:border-primary/30 hover:bg-glass-hover hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium">{action.label}</span>
              <kbd className="ml-auto rounded bg-background px-1.5 py-0.5 text-[9px] text-muted-foreground">
                {action.shortcut}
              </kbd>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}