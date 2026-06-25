"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { useAppStore } from "@/store/app-store";
import { mainNavItems, secondaryNavItems } from "@/shared/constants/navigation";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  Command,
  Zap,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebarCollapse, setCommandPaletteOpen } =
    useAppStore();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-spring",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-sm font-bold tracking-tight text-foreground">
            OrionOS
          </span>
        )}
      </div>

      {/* Command palette trigger */}
      <div className="px-3 pt-4 pb-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className={cn(
            "flex w-full items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
            sidebarCollapsed && "justify-center px-0"
          )}
        >
          <Command className="h-3.5 w-3.5" />
          {!sidebarCollapsed && (
            <>
              <span>Search...</span>
              <kbd className="ml-auto rounded bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Main nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <div className="space-y-1">
          {!sidebarCollapsed && (
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Main
            </p>
          )}
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary/10 text-primary shadow-glow"
                    : "text-sidebar-foreground hover:bg-glass-hover hover:text-foreground",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold text-primary">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-6 space-y-1">
          {!sidebarCollapsed && (
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              More
            </p>
          )}
          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-glass-hover hover:text-foreground",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3">
        <div
          className={cn(
            "flex items-center gap-3",
            sidebarCollapsed && "justify-center"
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-foreground">
                Alex Kim
              </p>
              <p className="truncate text-xs text-muted-foreground">
                alex@orion.dev
              </p>
            </div>
          )}
          <button
            onClick={toggleSidebarCollapse}
            className="rounded-md p-1 text-muted-foreground hover:bg-glass-hover hover:text-foreground transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
