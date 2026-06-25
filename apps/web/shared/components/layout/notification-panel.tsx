"use client";

import { useAppStore } from "@/store/app-store";
import { Button } from "@/shared/components/ui/button";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Notification } from "@/shared/types";

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Task completed",
    message: "Design review has been marked as done",
    type: "success",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: "2",
    title: "New email",
    message: "Sarah sent you a message about the Q4 report",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "3",
    title: "Meeting in 15 min",
    message: "Team sync starts at 2:00 PM",
    type: "warning",
    read: true,
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: "4",
    title: "Build failed",
    message: "CI pipeline failed on main branch",
    type: "error",
    read: true,
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
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

export function NotificationPanel() {
  const { notificationPanelOpen, setNotificationPanelOpen } = useAppStore();

  if (!notificationPanelOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0"
        onClick={() => setNotificationPanelOpen(false)}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-sm border-l border-border bg-card shadow-floating">
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <h2 className="text-sm font-semibold">Notifications</h2>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setNotificationPanelOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="overflow-y-auto p-2" style={{ height: "calc(100% - 56px)" }}>
          {mockNotifications.map((notification) => {
            const Icon = iconMap[notification.type];
            return (
              <div
                key={notification.id}
                className={cn(
                  "flex gap-3 rounded-lg p-3 transition-colors hover:bg-glass-hover cursor-pointer",
                  !notification.read && "bg-primary/5"
                )}
              >
                <Icon
                  className={cn("mt-0.5 h-4 w-4 shrink-0", colorMap[notification.type])}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
