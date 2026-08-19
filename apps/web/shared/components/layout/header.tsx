"use client";

import { useAppStore } from "@/store/app-store";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Bell, CalendarDays, ChevronDown, Menu, Search } from "lucide-react";

export function Header() {
  const { setCommandPaletteOpen, setNotificationPanelOpen, toggleSidebar } =
    useAppStore();

  return (
    <header className="orion-dashboard-header flex h-[56px] shrink-0 items-center gap-3 px-3 sm:px-4">
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label="Open navigation"
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-foreground/[0.05] text-foreground transition hover:bg-foreground/[0.09] lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={() => setCommandPaletteOpen(true)}
        className="orion-glass-control flex h-9 min-w-0 max-w-[500px] flex-1 items-center gap-3 rounded-lg px-3 text-left text-[11px] text-muted-foreground transition hover:border-primary/25 hover:bg-foreground/[0.08]"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="truncate">Search anything... (e.g. leads, deals, reports)</span>
        <kbd className="ml-auto hidden shrink-0 rounded border border-border px-1.5 py-0.5 text-[10px] sm:inline-block">
          ⌘ K
        </kbd>
      </button>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => setNotificationPanelOpen(true)}
          aria-label="Notifications, 3 unread"
          className="relative grid h-10 w-10 place-items-center rounded-xl text-muted-foreground transition hover:bg-foreground/[0.07] hover:text-foreground"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
            3
          </span>
        </button>

        <button
          type="button"
          aria-label="Calendar"
          className="grid h-10 w-10 place-items-center rounded-xl text-muted-foreground transition hover:bg-foreground/[0.07] hover:text-foreground max-sm:hidden"
        >
          <CalendarDays className="h-[18px] w-[18px]" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition hover:bg-foreground/[0.07]"
        >
          <Avatar className="h-9 w-9 ring-1 ring-primary/25">
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>
          <span className="hidden text-left leading-tight md:block">
            <span className="block text-[13px] font-medium text-foreground">
              Alex Morgan
            </span>
            <span className="block text-[11px] text-muted-foreground">
              Administrator
            </span>
          </span>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground md:block" />
        </button>
      </div>
    </header>
  );
}
