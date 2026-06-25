"use client";

import { cn } from "@/shared/lib/utils";
import { useAppStore } from "@/store/app-store";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { Header } from "@/shared/components/layout/header";
import { CommandPalette } from "@/shared/components/layout/command-palette";
import { NotificationPanel } from "@/shared/components/layout/notification-panel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300 ease-spring",
          sidebarCollapsed ? "ml-16" : "ml-60"
        )}
      >
        <Header />
        <main className="p-6">{children}</main>
      </div>
      <CommandPalette />
      <NotificationPanel />
    </div>
  );
}
