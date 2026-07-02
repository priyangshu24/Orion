"use client";

import { Sidebar } from "@/shared/components/layout/sidebar";
import { Header } from "@/shared/components/layout/header";
import { BottomDock } from "@/shared/components/layout/bottom-dock";
import { CommandPalette } from "@/shared/components/layout/command-palette";
import { NotificationPanel } from "@/shared/components/layout/notification-panel";

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen overflow-hidden bg-background">
      <div className="ambient-orb ambient-orb-one pointer-events-none" />
      <div className="ambient-orb ambient-orb-two pointer-events-none" />
      <div className="ambient-grid pointer-events-none" />

      <div className="orion-cockpit liquid-glass relative z-20 flex h-full w-full overflow-hidden">
        <Sidebar />

        <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header />
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-5 pb-28 pt-[104px] sm:px-6 lg:px-6">
            {children}
          </main>
        </div>

        <BottomDock />
      </div>

      <CommandPalette />
      <NotificationPanel />
    </div>
  );
}