"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { useAppStore } from "@/store/app-store";
import { mainNavItems, secondaryNavItems } from "@/shared/constants/navigation";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { OrionLogo } from "@/shared/components/layout/orion-logo";
import { ChevronLeft, ChevronRight, Command } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const {
    sidebarOpen,
    sidebarCollapsed,
    toggleSidebarCollapse,
    setSidebarOpen,
    setCommandPaletteOpen,
  } = useAppStore();

  return (
    <>
      <aside
        className={cn(
          "neon-panel relative z-40 m-3 flex h-[calc(100%-24px)] w-[246px] shrink-0 flex-col overflow-hidden rounded-[28px] transition-[width,transform] duration-300 ease-out will-change-transform max-lg:fixed max-lg:inset-y-3 max-lg:left-3 max-lg:m-0 max-lg:h-[calc(100vh-24px)] lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-[120%]",
          sidebarCollapsed && "lg:w-[78px]"
        )}
      >
        <div className={cn("flex h-[72px] items-center gap-3 px-5", sidebarCollapsed && "justify-center px-0")}>
          <OrionLogo showWordmark={!sidebarCollapsed} markClassName={sidebarCollapsed ? "h-9 w-9 rounded-xl" : undefined} />
        </div>

        <div className={cn("px-4 pb-3 pt-1", sidebarCollapsed && "px-3")}>
          <button
            type="button"
            onClick={() => setCommandPaletteOpen(true)}
            className={cn(
              "flex w-full items-center gap-2 rounded-2xl border border-foreground/10 bg-foreground/[0.06] px-3 py-2.5 text-xs text-muted-foreground shadow-inner shadow-white/5 transition-all hover:bg-foreground/10 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              sidebarCollapsed && "justify-center px-0"
            )}
          >
            <Command className="h-3.5 w-3.5" />
            {!sidebarCollapsed && (
              <>
                <span>Quick command...</span>
                <kbd className="ml-auto rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  ⌘ K
                </kbd>
              </>
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <div className="space-y-1">
            {!sidebarCollapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                Main
              </p>
            )}
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.98]",
                    isActive
                      ? "neon-active"
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
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/80">
                More
              </p>
            )}
            {secondaryNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-200 active:scale-[0.98]",
                    isActive
                      ? "neon-active"
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

        <div className="p-3">
          {sidebarCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-9 w-9 ring-1 ring-white/10">
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={toggleSidebarCollapse}
                aria-label="Expand sidebar"
                className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-glass-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.05] p-2">
              <Avatar className="h-9 w-9 shrink-0 ring-1 ring-white/10">
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">Alex Kim</p>
                <p className="truncate text-xs text-muted-foreground">alex@orion.dev</p>
              </div>
              <button
                type="button"
                onClick={toggleSidebarCollapse}
                aria-label="Collapse sidebar"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-glass-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
}
