"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { AlertCircle, AlertTriangle, Bell, CheckCircle, Info, MailCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const notifications = [
  { id: "1", title: "Task completed", message: "Design review has been marked as done", type: "success", read: false, time: "5m ago" },
  { id: "2", title: "New email", message: "Sarah sent you a message about the Q4 report", type: "info", read: false, time: "30m ago" },
  { id: "3", title: "Meeting in 15 min", message: "Team sync starts at 2:00 PM", type: "warning", read: true, time: "1h ago" },
  { id: "4", title: "Build failed", message: "CI pipeline failed on main branch", type: "error", read: true, time: "2h ago" },
  { id: "5", title: "Weekly digest ready", message: "Your productivity summary is ready to review", type: "info", read: true, time: "4h ago" },
];

const iconMap = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
};

const colorMap = {
  success: "text-success",
  info: "text-info",
  warning: "text-warning",
  error: "text-destructive",
};

export default function NotificationsPage() {
  const [readIds, setReadIds] = useState(() => new Set(notifications.filter((item) => item.read).map((item) => item.id)));
  const unreadCount = notifications.filter((item) => !readIds.has(item.id)).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            {unreadCount} unread updates across tasks, email, calendar, and system events.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setReadIds(new Set(notifications.map((item) => item.id)))}
        >
          <MailCheck className="h-4 w-4" /> Mark all read
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-8">
          <CardHeader>
            <CardTitle>Inbox</CardTitle>
            <CardDescription>Mock notification center for Phase 1.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((item) => {
              const Icon = iconMap[item.type as keyof typeof iconMap];
              const isRead = readIds.has(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setReadIds((current) => new Set(current).add(item.id))}
                  className={cn(
                    "flex w-full gap-3 rounded-2xl border border-border/60 p-4 text-left transition-all hover:bg-glass-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isRead ? "bg-card" : "bg-primary/5"
                  )}
                >
                  <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", colorMap[item.type as keyof typeof colorMap])} />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{item.title}</span>
                      {!isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">{item.message}</span>
                  </span>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{item.time}</span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>Routing preview for notification settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Tasks", "Email", "Calendar", "System"].map((label) => (
              <div key={label} className="flex items-center justify-between rounded-xl border border-border/60 bg-glass p-3">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
                <Badge variant="secondary">On</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
