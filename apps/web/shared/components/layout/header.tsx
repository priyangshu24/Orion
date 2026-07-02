"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/shared/components/ui/button";
import { Bell, Moon, Sun, Search, Menu, Sparkles, SlidersHorizontal } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/shared/lib/utils";

export function Header() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { setCommandPaletteOpen, setNotificationPanelOpen, toggleSidebar } = useAppStore();
  const isTasks = pathname === "/tasks";

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = !mounted || resolvedTheme !== "light";

  // Collapse the floating search bar into a circular button as the page scrolls.
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    let main: HTMLElement | null = null;
    const onScroll = () => {
      if (!main || !main.isConnected) main = document.querySelector("main");
      const y = main ? main.scrollTop : window.scrollY;
      // Hysteresis: collapse past 56px, expand again under 16px — avoids flicker.
      setCollapsed((prev) => (prev ? y > 16 : y > 56));
    };
    onScroll();
    // Capture phase: scroll events don't bubble, but capturing on window
    // catches them from whichever element actually scrolls (the <main>).
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, []);

  const glass =
    "border border-glass-border bg-glass shadow-[0_22px_70px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-3xl";

  return (
    <header className="pointer-events-none absolute left-0 right-0 top-0 z-30 flex h-[86px] items-center justify-center px-5 sm:px-6">
      {/* Expanded floating search bar */}
      <div
        className={cn(
          "pointer-events-auto flex w-full max-w-[680px] origin-right items-center gap-3 rounded-[24px] px-3 py-2 transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
          glass,
          collapsed
            ? "pointer-events-none translate-x-10 scale-90 opacity-0 blur-[2px]"
            : "translate-x-0 scale-100 opacity-100 blur-0"
        )}
      >
        <Button variant="ghost" size="icon-sm" onClick={toggleSidebar} aria-label="Open navigation" className="rounded-2xl text-foreground lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>

        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-[18px] border border-foreground/10 bg-foreground/[0.06] px-4 text-left text-sm text-muted-foreground shadow-inner shadow-white/5 transition hover:bg-foreground/10 hover:text-foreground"
        >
          <Search className="h-4 w-4 shrink-0 text-primary" />
          <span className="truncate">{isTasks ? "Search tasks, labels, assignees..." : "Search workspace..."}</span>
          <kbd className="ml-auto hidden rounded-lg border border-foreground/10 bg-foreground/[0.06] px-2 py-1 text-[10px] text-muted-foreground sm:inline-flex">
            Ctrl K
          </kbd>
        </button>

        <button
          type="button"
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-[18px] border border-foreground/10 bg-foreground/[0.06] text-foreground shadow-inner shadow-white/5 transition hover:bg-foreground/10 sm:flex"
          aria-label="Filter"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </button>

        <div className="hidden h-8 w-px bg-foreground/10 md:block" />

        <div className="hidden items-center gap-2 text-xs text-muted-foreground lg:flex">
          <Sparkles className="h-3.5 w-3.5 text-success" />
          <span>Online</span>
        </div>

        <Button variant="ghost" size="icon-sm" onClick={() => setNotificationPanelOpen(true)} aria-label="Open notifications" className="relative rounded-[18px] border border-foreground/10 bg-foreground/[0.06] text-foreground hover:bg-foreground/10">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label="Toggle theme"
          className="rounded-[18px] border border-foreground/10 bg-foreground/[0.06] text-foreground hover:bg-foreground/10"
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>

      {/* Collapsed circular search button (top-right) */}
      <button
        type="button"
        onClick={() => setCommandPaletteOpen(true)}
        aria-label="Search workspace"
        className={cn(
          "pointer-events-auto absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full text-foreground transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform hover:scale-105 active:scale-95 sm:right-6",
          glass,
          collapsed
            ? "scale-100 opacity-100"
            : "pointer-events-none translate-x-2 scale-50 opacity-0"
        )}
      >
        <Search className="h-5 w-5 text-primary" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
      </button>
    </header>
  );
}
