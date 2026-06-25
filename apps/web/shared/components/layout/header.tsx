"use client";

import { usePathname } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { Button } from "@/shared/components/ui/button";
import { Bell, Moon, Sun, Search, Menu } from "lucide-react";
import { useTheme } from "next-themes";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tasks": "Tasks",
  "/calendar": "Calendar",
  "/emails": "Emails",
  "/ai": "AI Assistant",
  "/settings": "Settings",
  "/analytics": "Analytics",
  "/habits": "Habits",
  "/notifications": "Notifications",
};

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { setCommandPaletteOpen, setNotificationPanelOpen, toggleSidebar } =
    useAppStore();

  const title = pageTitles[pathname] || "OrionOS";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-sm font-semibold">{title}</h1>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setCommandPaletteOpen(true)}
          className="text-muted-foreground"
        >
          <Search className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setNotificationPanelOpen(true)}
          className="relative text-muted-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-muted-foreground"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  );
}
