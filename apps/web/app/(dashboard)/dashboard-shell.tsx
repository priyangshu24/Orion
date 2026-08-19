"use client";

import { Sidebar } from "@/shared/components/layout/sidebar";
import { Header } from "@/shared/components/layout/header";
import { CommandPalette } from "@/shared/components/layout/command-palette";
import { NotificationPanel } from "@/shared/components/layout/notification-panel";

export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /* orion-space paints the deep-space background: photo when
       /orion-space-bg.jpg is present, procedural nebula + starfield otherwise.
       See "Orion deep-space background" in app/globals.css. */
    <div className="orion-space orion-dashboard relative flex h-screen overflow-hidden">
      <Sidebar />

      <div className="orion-dashboard-stage relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />
        <main className="orion-dashboard-main min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-3 pt-3 sm:px-4">
          {children}
        </main>
      </div>

      <CommandPalette />
      <NotificationPanel />
    </div>
  );
}
