"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/shared/components/ui/button";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle, MailCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { Notification } from "@/shared/types";

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Task completed",
    message: "Design review has been marked as done",
    type: "success",
    read: false,
    createdAt: "2026-06-26T08:55:00.000Z",
  },
  {
    id: "2",
    title: "New email",
    message: "Sarah sent you a message about the Q4 report",
    type: "info",
    read: false,
    createdAt: "2026-06-26T08:30:00.000Z",
  },
  {
    id: "3",
    title: "Meeting in 15 min",
    message: "Team sync starts at 2:00 PM",
    type: "warning",
    read: true,
    createdAt: "2026-06-26T08:00:00.000Z",
  },
  {
    id: "4",
    title: "Build failed",
    message: "CI pipeline failed on main branch",
    type: "error",
    read: true,
    createdAt: "2026-06-26T07:00:00.000Z",
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
  const [notifications, setNotifications] = useState(initialNotifications);

  useEffect(() => {
    if (!notificationPanelOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setNotificationPanelOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notificationPanelOpen, setNotificationPanelOpen]);

  if (!notificationPanelOpen) return null;

  const unreadCount = notifications.filter((notification) => !notification.read).length;

  function markRead(notificationId: string) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={() => setNotificationPanelOpen(false)}
      />
      <div className="neon-panel absolute bottom-3 right-3 top-3 flex w-[384px] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[26px] shadow-floating">
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div>
            <h2 className="text-sm font-semibold">Notifications</h2>
            <p className="text-[10px] text-muted-foreground">{unreadCount} unread</p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Mark all notifications read"
              onClick={() => setNotifications((current) => current.map((item) => ({ ...item, read: true })))}
            >
              <MailCheck className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close notifications"
              onClick={() => setNotificationPanelOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 space-y-1.5 overflow-y-auto p-3">
          {notifications.map((notification) => {
            const Icon = iconMap[notification.type];
            return (
              <button
                key={notification.id}
                type="button"
                onClick={() => markRead(notification.id)}
                className={cn(
                  "flex w-full cursor-pointer gap-3 rounded-2xl border border-transparent p-3 text-left transition-all hover:border-white/10 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  !notification.read && "border-white/10 bg-white/[0.05]"
                )}
              >
                <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", colorMap[notification.type])} />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground">{notification.message}</p>
                </div>
                {!notification.read && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary shadow-glow" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}